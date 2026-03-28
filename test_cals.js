const {google} = require('googleapis');
const key = require('/home/dataling/.openclaw/config/credentials/service-account-james.json');
const auth = new google.auth.GoogleAuth({credentials: key, scopes: ['https://www.googleapis.com/auth/calendar.readonly']});
google.calendar({version:'v3',auth}).calendarList.list().then(r=>{
  if (r.data.items) {
    r.data.items.forEach(c=>console.log(c.id, c.summary));
  }
}).catch(e=>console.error(e.message));
