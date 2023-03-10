import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, RemoteBackend } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { Instance } from "@cdktf/provider-aws/lib/instance";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "us-west-1",
    });

    const ec2Instance = new Instance(this, "compute", {
      ami: "ami-01456a894f71116f2",
      instanceType: "t2.micro",
    });

    new TerraformOutput(this, "public_ip", {
      value: ec2Instance.publicIp,
    });
  }
}

const app = new App();
const stack = new MyStack(app, "aws_instance");

new RemoteBackend(stack, {
  hostname: "app.terraform.io",
  organization: "example-org-0ee743",
  workspaces: {
    name: "learn-cdktf",
  },
});

app.synth();