import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'

function required(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

export function getBucket() {
  return required('R2_BUCKET')
}

export function getPublicUrl() {
  return required('R2_PUBLIC_URL').replace(/\/$/, '')
}

export function createR2Client() {
  const accountId = required('R2_ACCOUNT_ID')
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required('R2_ACCESS_KEY_ID'),
      secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
    },
  })
}

export async function getObjectBuffer(client, key) {
  const result = await client.send(
    new GetObjectCommand({
      Bucket: getBucket(),
      Key: key,
    }),
  )
  const bytes = await result.Body.transformToByteArray()
  return Buffer.from(bytes)
}

export async function putObject(client, { key, body, contentType }) {
  await client.send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
  return `${getPublicUrl()}/${key}`
}
