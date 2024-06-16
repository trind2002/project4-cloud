# Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
serverless login
# Configure serverless to use the AWS credentials to deploy the application
# You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
serverless config credentials --provider aws --key ASIAXACO3LTGLUDTABNY --secret afiO4oJ2K2LkP6EEVnEAdxI+C9S9qebxoS68EhBv --profile serverless

# Remove SLS
serverless remove --stage dev --region us-east-1