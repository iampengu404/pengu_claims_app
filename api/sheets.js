import { google } from 'googleapis'
import moment from 'moment'
import { isAddress } from 'web3-validator'

export async function GET(request) {

  const address = request.url.split("=")[1]
  const now = moment().format('LLL')

  if (!isAddress(address)) {
    return new Response('Invalid address')
  }

  const client = new google.auth.JWT(process.env.VITE_CLIENT_EMAIL, null, process.env.VITE_PRIVATE_KEY, ['https://www.googleapis.com/auth/spreadsheets'])
  const sheet = google.sheets({ version: 'v4', auth: client})
  await sheet.spreadsheets.values.append({
    spreadsheetId: '1gl8WYLmfoBOPEgOYqKEErhr5fMjkbUAnvWWSaGdOMEc',
    range: 'Addresses!A2:B',
    insertDataOption: 'INSERT_ROWS',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[ address, now ]]
    }
  })

  return new Response(`Saved ${now}`)
}