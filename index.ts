import * as aws from "@pulumi/aws";

let callerArn = aws.getCallerIdentity().then((identity) => {
    return identity.arn;
});

const role = new aws.iam.Role(`role`, {
    assumeRolePolicy: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: { AWS: callerArn },
                Action: "sts:AssumeRole",
            },
        ],
    },
});

const provider = new aws.Provider(`provider`, {
    assumeRole: { roleArn: role.arn },
});

const getZone = aws.route53.getZone(
    {
        name: "test.com-9dc4e00",
    },
    {
        provider,
    }
);

export let zone = getZone;
