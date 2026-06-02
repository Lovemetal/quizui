const fs = require('fs');

// These will be provided by GitHub Secrets in production, or a local .env file
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID; 

async function fetchTable(tableName) {
	console.log(AIRTABLE_ACCESS_TOKEN, ' ', BASE_ID)
  const url = `https://api.airtable.com/v0/${BASE_ID}/${tableName}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}` }
  });
  const data = await response.json();
  console.log('data')
  console.log(data)
  return data.records.map(record => ({
    id: record.id,
    ...record.fields
  }));
}

async function main() {
  try {
    const schedule = await fetchTable('schedule_june_2026');
    const standings = await fetchTable('standings_classic_june_2026');

    const allData = { schedule, standings };

    // Save the data to a JSON file that your frontend can access
    fs.writeFileSync('./data.json', JSON.stringify(allData, null, 2));
    console.log('Data successfully fetched and saved to data.json');
  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
}

main();