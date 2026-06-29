import argparse
import sys

import boto3
from botocore.exceptions import ClientError


def create_bucket(s3_client, bucket_name: str, region: str | None = None) -> None:
	if region and region != "us-east-1":
		s3_client.create_bucket(
			Bucket=bucket_name,
			CreateBucketConfiguration={"LocationConstraint": region},
		)
	else:
		s3_client.create_bucket(Bucket=bucket_name)


def delete_bucket(s3_client, bucket_name: str) -> None:
	s3_client.delete_bucket(Bucket=bucket_name)


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(
		description="Create or delete an S3 bucket using a flag and bucket name."
	)
	parser.add_argument("bucket_name", help="Name of the S3 bucket")
	parser.add_argument(
		"--region",
		default=None,
		help="AWS region for bucket creation (optional)",
	)

	action_group = parser.add_mutually_exclusive_group(required=True)
	action_group.add_argument(
		"--create",
		action="store_true",
		help="Create the bucket",
	)
	action_group.add_argument(
		"--delete",
		action="store_true",
		help="Delete the bucket",
	)

	return parser.parse_args()


def main() -> int:
	args = parse_args()
	s3_client = boto3.client("s3", region_name=args.region)

	try:
		if args.create:
			create_bucket(s3_client, args.bucket_name, args.region)
			print(f"Bucket created: {args.bucket_name}")
		elif args.delete:
			delete_bucket(s3_client, args.bucket_name)
			print(f"Bucket deleted: {args.bucket_name}")
	except ClientError as exc:
		print(f"AWS error: {exc}", file=sys.stderr)
		return 1

	return 0


if __name__ == "__main__":
	raise SystemExit(main())
