import { authorize, downloadSQLiteFile } from "../lib/googleDrive";

export async function GET() {
    const auth = await authorize();
	const fileId = import.meta.env.SQLITE_FILE_ID;
	await downloadSQLiteFile(auth, fileId);
	return new Response();
}