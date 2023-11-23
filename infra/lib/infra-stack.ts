import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', {
      isDefault: true
    });

    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: vpc,
      description: 'Allow inbound on port 80 and 443, and all outbound.',
      allowAllOutbound: true
    });
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic from anywhere'
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic from anywhere'
    );
    // SSH ingress rule required for EC2 Instance Connect. Not recommended to have from any IPv4 in production.
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH traffic from anywhere'
    );

    const userDataScript = readFileSync('./lib/user-data.sh', 'utf-8');
    const userData = ec2.UserData.custom(userDataScript);
    const ec2Instance = new ec2.Instance(this, 'EC2Instance', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      securityGroup: securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      userDataCausesReplacement: true,
      userData: userData
    });

    const elasticIp = new ec2.CfnEIP(this, 'ElasticIP');
    const elasticIpAssociation = new ec2.CfnEIPAssociation(this, 'ElasticIPAssociation', {
      allocationId: elasticIp.attrAllocationId,
      instanceId: ec2Instance.instanceId
    });

    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'cloudchaotic.com'
    });
    new ARecord(this, 'ARecord', {
      zone: hostedZone,
      recordName: 'weather',
      target: RecordTarget.fromIpAddresses(elasticIp.attrPublicIp),
      ttl: cdk.Duration.seconds(0) // not ideal
    })
  }
}
