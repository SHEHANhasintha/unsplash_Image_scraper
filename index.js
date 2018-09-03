const https = require('https');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const dns = require('dns');
const { Resolver } = require('dns');


/*request("https://unsplash.com/search/photos/mountain",(res) => {

});*/

function dnsLookup(address){
	dns.lookup(`${address}`,(err,address,family) => {
		if (address === undefined && family === undefined){
			consolo.log('No Connection');
		}else{
			console.log('address: %j family: IPv%s', address, family);
			//downloadImages();
		}
		
	});
}

function downloadImages(input){
//request pages
	request(`https://unsplash.com/search/photos/${input}`, (err,res,body) => {
		let props = [];
		
		console.log(`Headers: ${JSON.stringify(res.headers)}`);
		console.log(`res.statusCode ${res.statusCode}`);
		
		res.setEncoding('utf8');

		// sample peace verify
		res.on('data', (chunk) => {
			fs.appendFile('index.html',chunk,function(err){
				console.log(`problem with ${err}`);
			})
		})


		//error render
		res.on('err', () => {
			console.log(`problem with ${err}`);
		})



		if (!err && res.statusCode === 200){

			//collect data
			let $ = cheerio.load(body);
			let classes = $('._2zEKz')
			for (let i=0;i<classes.length;i++){
				if (Object.keys(classes[parseInt(i)].attribs.src)){
					props.push({
						alt:classes[parseInt(i)].attribs.alt ? classes[parseInt(i)].attribs.alt : `${input}${i}`,
						src:classes[parseInt(i)].attribs.src ? classes[parseInt(i)].attribs.src : 'unreachable'
					});
				}
			}
			console.log(`Total photos: ${props.length}`);

			//download photos
			props.forEach(function(element){
				try {
					if (element.src != 'unreachable'){
						request(element.src).pipe(fs.createWriteStream(`image/${element.alt}.jpg`));
					}
				}catch (ex){
					console.log(ex);
				}
			});

		}

		res.on('end',() => {
			console.log('done',addresses);
		})


	});

}



dnsLookup('google.com');
downloadImages('trees');