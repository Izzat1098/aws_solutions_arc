import { S3Client, CreateBucketCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";


async function createBucket(s3Client, bucketName, region) {
	console.log(`Creating bucket ${bucketName} in region ${region}...`);
	const input = { Bucket: bucketName };
	if (region !== "us-east-1") {
		input.CreateBucketConfiguration = { LocationConstraint: region };
	}
	await s3Client.send(new CreateBucketCommand(input));
}

async function deleteBucket(s3Client, bucketName) {
	console.log(`Deleting bucket ${bucketName}...`);
	await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
}

function parse_Args(argv) {
	const { values, positionals } = parseArgs({
		args: argv.slice(2),
		allowPositionals: true,
		strict: true,
		options: {
			region: { type: "string" },
			create: { type: "boolean", short: "c", default: false },
			delete: { type: "boolean", short: "d", default: false },
		},
	});

	if (positionals.length !== 1) {
		throw new Error("bucket_name is required");
	}

	if (values.create === values.delete) {
		throw new Error("Exactly one of --create or --delete is required");
	}

	return {
		bucketName: positionals[0],
		region: values.region,
		action: values.create ? "create" : "delete",
	};
}


function printUsage() {
	console.error("Usage: node index.js [--region REGION] (-c|--create | -d|--delete) <bucket_name>");
}


export async function main(argv = process.argv) {
	let parsed;

	try {
		parsed = parse_Args(argv);
	} catch (err) {
		console.error(err.message);
		printUsage();
		return 1;
	}

	const resolvedRegion = parsed.region ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1";
	const s3Client = new S3Client({ region: resolvedRegion });

	try {
		if (parsed.action === "create") {
			await createBucket(s3Client, parsed.bucketName, resolvedRegion);
			console.log(`Bucket created: ${parsed.bucketName}`);
		} else {
			await deleteBucket(s3Client, parsed.bucketName);
			console.log(`Bucket deleted: ${parsed.bucketName}`);
		}
	} catch (err) {
		console.error(`AWS error: ${err}`);
		return 1;
	}

	return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const exitCode = await main();
	process.exit(exitCode);
}
