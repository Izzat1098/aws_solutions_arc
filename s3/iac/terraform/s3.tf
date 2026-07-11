provider "aws" {
  # Configuration options, but loaded from env var
}

resource "aws_s3_bucket" "my-s3-bucket" {
  tags = {
    Name        = "My TF bucket"
    Environment = "Dev"
  }
}