# Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
serverless login
# Configure serverless to use the AWS credentials to deploy the application
# You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless