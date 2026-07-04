import { S3Client, CreateBucketCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";


function createBucketCommandInput(bucketName, region) {
	const resolvedRegion = region ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1";

	if (!region) {
		console.log(`Creating bucket in default region ${resolvedRegion}`);
	} else {
		console.log(`Creating bucket in user-specified region: ${resolvedRegion}`);
	}

	const input = { Bucket: bucketName };

	// S3 requires omitting LocationConstraint for us-east-1.
	if (resolvedRegion !== "us-east-1") {
		input.CreateBucketConfiguration = { LocationConstraint: resolvedRegion };
	}

	return input;
}

async function createBucket(s3Client, bucketName, region) {
	const input = createBucketCommandInput(bucketName, region);
	await s3Client.send(new CreateBucketCommand(input));
}

async function deleteBucket(s3Client, bucketName) {
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

	const s3Client = new S3Client({ region: parsed.region ?? undefined });

	try {
		if (parsed.action === "create") {
			console.log("Creating bucket...");
			await createBucket(s3Client, parsed.bucketName, parsed.region);
			console.log(`Bucket created: ${parsed.bucketName}`);
		} else {
			console.log("Deleting bucket...");
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
