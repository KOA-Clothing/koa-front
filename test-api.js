const https = require('https');
https.get('https://localhost:7198/api/v1/catalogue/products/01a0a66a-08aa-77f1-a75a-2ffbf908685a', {rejectUnauthorized:false}, (res)=>{
  console.log(res.statusCode);
  let d='';
  res.on('data',c=>d+=c);
  res.on('end',()=>{
    try {
      const j = JSON.parse(d);
      console.log(j.name);
    } catch(e) {
      console.log(d.substring(0,100));
    }
  });
}).on('error',(e)=>{console.log('err');});
