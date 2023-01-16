const setting = {
  "WelcomeLogo": false,
  "debug": false,
  "Mark_Errors_In_File": true,
  "Target_URL": "https://asclepiuswellness.com/userpanel/UserWinterBonanza.aspx",
  "maxConcurrency": 12,
  "slowMo": 100
}
console.time('Time Taken ');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const Power = require('child_process');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const { PendingXHR } = require('pending-xhr-puppeteer');
const cliW = require('cli-width');
const { Cluster } = require(path.join(__dirname, '/node_modules/puppeteer-cluster'));
const Terminator = '-='.repeat(cliW() / 4)
const Wrongs = [], levels = ['FRESHER', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'TOPAZ', 'RUBY STAR', 'SAPPHIRE', 'STAR SAPPHIRE', 'DIAMOND', 'BLUE DIAMOND', 'BLACK DIAMOND', 'ROYAL DIAMOND', 'CROWN DIAMOND', 'AMBASSADOR', 'ROYAL AMBASSADOR', 'CROWN AMBASSADOR', 'BRAND AMBASSADOR'];
const WelcomeLogo = async function () {
  console.log(colors.dim(Terminator));
  console.log(colors.green("  █████╗ ██╗    ██╗██████╗ ██╗     "));
  console.log(colors.green(" ██╔══██╗██║    ██║██╔══██╗██║     "));
  console.log(colors.green(" ███████║██║ █╗ ██║██████╔╝██║     "));
  console.log(colors.green(" ██╔══██║██║███╗██║██╔═══╝ ██║     "));
  console.log(colors.green(" ██║  ██║╚███╔███╔╝██║     ███████╗"));
  console.log(colors.green(" ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝     ╚══════╝"));
  console.log(colors.yellow("$Xx=+;:. ╦ ╦╔═╗╦  ╔═╗╔═╗╦═╗ .:;+xX$"));
  console.log(colors.yellow("$Xx=+;:. ╠═╣║╣ ║  ╠═╝║╣ ╠╦╝ .:;+xX$"));
  console.log(colors.yellow("$Xx=+;:. ╩ ╩╚═╝╩═╝╩  ╚═╝╩╚═ .:;+xX$"));
  console.log(colors.dim(Terminator));
}
const outFile = async function () {
  if (!fs.existsSync(path.join(__dirname, '/out'))) {
    fs.mkdirSync(path.join(__dirname, '/out'));
  }
  var outDir = fs.readdirSync(path.join(__dirname, '/out'));
  try {
    outDir.forEach(el => {
      fs.unlinkSync(path.join(__dirname, '/out/', el));
    });
  } catch (error) {
    console.log(error);
    console.log(colors.red('ERROR : Please Close File to continue !'));
    process.exit(0);
  }
}
const login = async function (page, id, pass, name) {
  page.on('dialog', async dialog => {
    if (setting.Mark_Errors_In_File) {
      if (dialog.message() == "Plz Enter Right Userid or Password :") {
        console.log(`${colors.red('-ERROR- :')} ${colors.yellow(name)} : ${colors.dim("Wrong ID or Password!")}`);
        Wrongs.push({ name: name, data: [], level: "!Pass!", msg: "Wrong ID or Password!" });
      } else {
        console.log(`${colors.red('-ERROR- :')} ${colors.yellow(name)} : ${colors.dim(err.message.toString().replace(/(\r\n|\n|\r)/gm, ""))}`);
        Wrongs.push({ name: name, data: [], level: "!Pass!", msg: dialog.message() });
      }
    }
    dialog.dismiss();
  });
  await page.goto(`https://asclepiuswellness.com/userpanel/uservalidationnew.aspx?memberid=${id.replace(/\W/g, "")}&pwd=${pass.replace(/\W/g, "")}`, { waitUntil: 'networkidle2' });
  return
};
const level = async function (page, name) {
  await page.evaluate(() => window.open("https://asclepiuswellness.com/userpanel/LevelPandingListNew.aspx", "_self"))
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  const sleep = duration => new Promise(resolve => setTimeout(resolve, duration));
  await sleep(1000);
  await page.evaluate(() => {
    var table = document.querySelector('table')
    var data = [];
    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
    }
    for (var i = 1; i < table.rows.length; i++) {
      var tableRow = table.rows[i];
      var rowData = {};
      for (var j = 0; j < tableRow.cells.length; j++) {
        rowData[headers[j]] = tableRow.cells[j].innerHTML;
      }
      data.push(rowData);
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].status == 'Pending') {
        data = data[i]
      }
    }
    var div = document.createElement('div')
    div.id = 'myCustomDiv'
    div.innerText = JSON.stringify(data)
    document.querySelector('body').appendChild(div)
  });
  var RawData = JSON.parse(await page.evaluate(() => document.querySelector('#myCustomDiv').innerText));
  var data = {
    "name": name,
    "level": levels[Number(RawData.step) - 1].toUpperCase(),
    "remainsaosp": Number(RawData.remainsaosp).toFixed(),
    "remainsgosp": Number(RawData.remainsgosp).toFixed()
  };
  return data
};
const target = async function (page, name) {
  await page.evaluate((URL) => window.open(URL, "_self"), setting.Target_URL);
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  try {
    await page.evaluate((name) => {
      Maindata = {
        "name": name,
        "level": document.querySelector("#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(2)").textContent.substr(0, document.querySelector("#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(2)").textContent.length - 3).toUpperCase(),
        "remainsaosp": Number(document.querySelector("#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(5)").textContent).toFixed(),
        "remainsgosp": Number(document.querySelector("#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(6)").textContent).toFixed()
      }
      var div = document.createElement('div')
      div.id = 'myCustomDiv'
      div.innerText = JSON.stringify(Maindata)
      document.querySelector('body').appendChild(div)
    }, name);
  } catch (error) {
    console.log(`${colors.red('-ERROR- :')} ${colors.yellow(name)} : ${colors.dim("Target Page Empty!")}`);
    Wrongs.push({ name: name, level: "Null", msg: "Target Page Empty!" });
    return;
  }
  var RawData = JSON.parse(await page.evaluate(() => document.querySelector('#myCustomDiv').innerText))
  return RawData
};
const cheque = async function (page, name) {
  const pending = new PendingXHR(page);
  await page.evaluate(() => window.open("https://asclepiuswellness.com/userpanel/UserLevelNew.aspx", "_self"))
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  const sleep = duration => new Promise(resolve => setTimeout(resolve, duration));
  await page.evaluate(() => {
    let d = new Date();
    const pad = function (nbr) { return (nbr < 10) ? "0" + nbr : nbr }
    var omb = pad(d.getDate()) + '/' + pad((d.getMonth() == 0) ? "12" : d.getMonth()) + '/' + ((d.getMonth() == 0) ? d.getFullYear() - 1 : d.getFullYear());
    document.querySelector("#ctl00_ContentPlaceHolder1_txtFrom").value = omb;
  })
  await page.click('#ctl00_ContentPlaceHolder1_btnshow');
  try {
    await pending.waitForAllXhrFinished()
    await page.waitForSelector("#ctl00_ContentPlaceHolder1_gvIncome > tbody > tr:nth-child(1) > th:nth-child(1)");
    await sleep(1000);
    await page.evaluate(() => {
      var table = document.querySelector('table')
      var data = [];
      var headers = [];
      for (var i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
      }
      for (var i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};
        for (var j = 0; j < tableRow.cells.length; j++) {
          rowData[headers[j]] = tableRow.cells[j].innerHTML;
        }
        data.push(rowData);
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].status == 'Pending') {
          data = data[i]
        }
      }
      let d = []
      data.forEach(el => {
        d.push({ "paydate": el.paydate.substr(0, 5), "amount": el.totalamount })
      })
      var div = document.createElement('div')
      div.id = 'myCustomDiv'
      div.innerText = JSON.stringify(d)
      document.querySelector('body').appendChild(div)
    });
    var RawData = JSON.parse(await page.evaluate(() => document.querySelector('#myCustomDiv').innerText))
  } catch (e) { var RawData = [] }
  await page.evaluate(() => window.open("https://asclepiuswellness.com/userpanel/LevelPandingListNew.aspx", "_self"))
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await sleep(1000);
  await page.evaluate(() => {
    var table = document.querySelector('table')
    var data = [];
    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
    }
    for (var i = 1; i < table.rows.length; i++) {
      var tableRow = table.rows[i];
      var rowData = {};
      for (var j = 0; j < tableRow.cells.length; j++) {
        rowData[headers[j]] = tableRow.cells[j].innerHTML;
      }
      data.push(rowData);
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].status == 'Pending') {
        data = data[i]
      }
    }
    const levels = [
      'Fresher',
      'Bronze',
      'Silver',
      'Gold',
      'Platinum',
      'Emerald',
      'Topaz',
      'Ruby Star',
      'Sapphire',
      'Star Sapphire',
      'Diamond',
      'Blue Diamond',
      'Black Diamond',
      'Royal Diamond',
      'Crown Diamond',
      'Ambassador',
      'Royal Ambassador',
      'Crown Ambassador',
      'Brand Ambassador'
    ]
    var div = document.createElement('div')
    div.id = 'myCustomDiv'
    div.innerText = levels[Number(data.step) - 1].toUpperCase()
    document.querySelector('body').appendChild(div)
  });
  var level = await page.evaluate(() => document.querySelector('#myCustomDiv').innerText);
  return {
    name: name,
    data: RawData,
    level: level
  }
}
const sort = async function (data, desend = true, host) {
  var out = [];
  var wrong = [];
  if (host == "Target") wrong = Wrongs;
  else Wrongs.forEach(el => {
    if (!el.msg.includes("Target")) wrong.push(el)
  })
  for (let i = 0; i < data.length; i++) {
    if (!levels.includes(data[i].level)) {
      wrong.push(data[i])
    }
  }
  if (desend) {
    for (let lvl = levels.length - 1; lvl >= 0; lvl--) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].level != undefined || data[i].level != null) {
          if (levels[lvl].toUpperCase() == data[i].level.toUpperCase()) {
            out.push(data[i])
          }
        }
      }
    }
  } else {
    for (let lvl = 0; lvl < levels.length; lvl++) {
      for (let i = 0; i < data.length; i++) {
        if (levels[lvl].toUpperCase() == data[i].level.toUpperCase()) {
          out.push(data[i])
        }
      }
    }
  }
  return out.concat(wrong)
};
const mine = async function (data, func, filename) {
  const cluster = await Cluster.launch({ // browser Lauch Properties
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    workerCreationDelay: 10,
    monitor: (setting.debug) ? true : false,
    timeout: 100000,
    retryLimit: 0,
    retryDelay: 10,
    maxConcurrency: (setting.debug) ? 1 : setting.maxConcurrency,
    puppeteer,
    puppeteerOptions: {
      executablePath: path.join(__dirname, "/chrome-win/chrome.exe"),
      headless: (setting.debug) ? false : true,
      slowMo: (setting.debug) ? 0 : setting.slowMo,
      defaultViewport: null,
      args: [
        `--start-maximized`, `--auto-open-devtools-for-tabs`
      ]
    },
  });
  // cluster.on('taskerror', async (err, { name }) => { // Error Handleing
  //     console.log(`${colors.red('-ERROR- :')} ${colors.yellow(name)} : ${colors.dim(err.message.toString())}`);
  // });
  const Level_Out = [];
  const Target_Out = [];
  const Current_Out = [];
  const Cheque_Out = [];
  await cluster.task(async ({ page, data: { id, pass, name } }) => { // Fetching Data
    await page.setRequestInterception(true); // Not Loading FONT and IMAGE
    page.on('request', (req) => {
      if (req.resourceType() == 'font' || req.resourceType() == 'image') req.abort();
      else req.continue();
    });
    // ---------------------- Calling Awpl Functions Acordingly ----------------------
    if (func.includes('Password Checker')) {
      const res = await fetch(`https://asclepiuswellness.com/userpanel/uservalidationnew.aspx?memberid=${id.replace(/\W/g, "")}&pwd=${pass.replace(/\W/g, "")}`);
      const body = await res.text();
      if (body.toString().includes("alert")) console.log(`${colors.red('-ERROR- : ')} ${colors.yellow(name)} : ${colors.dim("Wrong Credentials")}`);
    } else await login(page, id, pass, name);
    if (func.includes('Level Data')) {
      var data = await level(page, name);
      funcName = 'LEVEL';
      console.log(`${colors.green('SUCCESS')} : ${colors.blue(funcName)} : ${colors.yellow(name)} : ${colors.dim(data.level)}`);
      Level_Out.push(data); // push data to output
    }
    if (func.includes('Target Data')) {
      var data = await target(page, name);
      funcName = 'TARGET';
      console.log(`${colors.green('SUCCESS')} : ${colors.blue(funcName)} : ${colors.yellow(name)} : ${colors.dim(data.level)}`);
      Target_Out.push(data); // push data to output
    }
    if (func.includes('Current Data')) {
      var data = await dashboard(page, name);
      funcName = 'CURRENT';
      console.log(`${colors.green('SUCCESS')} : ${colors.blue(funcName)} : ${colors.yellow(name)} : ${colors.dim(data.level)}`);
      Current_Out.push(data); // push data to output
    }
    if (func.includes('Cheque Data')) {
      var data = await cheque(page, name);
      funcName = 'CHEQUE';
      console.log(`${colors.green('SUCCESS')} : ${colors.blue(funcName)} : ${colors.yellow(name)} : ${colors.dim(data.level)}`);
      Cheque_Out.push(data); // push data to output
    }
  });
  for (let i = 0; i < data.length; i++) { // calling Fetch for every Member
    cluster.queue(data[i]);
  }
  await cluster.idle(); // closeing when done
  await cluster.close(); // closeing when done
  if (Level_Out.length != 0) { // Handle Level Output File
    const Sorted_Level_Out = await sort(Level_Out, true, "Level"); // sorting Out Data by Level
    await print(Sorted_Level_Out, filename + ' Level Data');
  }
  if (Target_Out.length != 0) { // Handle Target Output File
    const Sorted_Target_Out = await sort(Target_Out, true, "Target"); // sorting Out Data by Level
    await print(Sorted_Target_Out, filename + ' Target Data');
  }
  if (Current_Out.length != 0) { // Handle Current Output FIle
    const Sorted_Current_Out = await sort(Current_Out); // sorting Out Data by Level
    await print(Sorted_Current_Out, filename + ' Current Data');
  }
  if (Cheque_Out.length != 0) { // Handle Cheque Output FIle
    const Sorted_Cheque_Out = await sort(Cheque_Out);
    await print(Sorted_Cheque_Out, filename + ' Cheque Data', "Cheque");
  }
};
const print = async function (data, filename, type = "SP") {
  fs.writeFileSync('./out/' + filename + ' Cheque Data.json', JSON.stringify(data, undefined, 2));
  const browser = await puppeteer.launch({
    executablePath: path.join(__dirname, "/chrome-win/chrome.exe"),
    defaultViewport: null,
  });
  const page = await browser.newPage();
  const style = `<style>
    * {color: aliceblue;margin: 0;padding: 0;font-family: cascadia code;text-align: left;}
    h1 {margin: 10px;text-align: center;}
    body {background-color: #0d1117;zoom: 1.15;}
    table {margin: auto;}
    td,th {padding: 5px;padding-left: 10px;border-left: 3px solid #30363d;width: min-content;}
    tr:nth-of-type(even) {background-color: #18202b;}
    th {font-size: 22px;border-bottom: 3px solid #30363d;}
    .a {color: #79c0ff;}
    .b {color: #ff7b72;}
    .c {color: #ff993f;}
    .d {color: #d2a8ff;}
    .e {color: #7ee778;}
    .g {color: #656565da;}
    </style>`;
  if (type === "SP") {
    let rows = ``;
    for (let i = 0; i < data.length; i++) {
      let condition = (data[i].level == "Null" || data[i].level == "!Pass!")
      let row = `<tr><td>${i + 1}</td>
            <td class="${condition ? 'g' : 'a'}">${data[i].name}</td>
            <td class="${condition ? 'g' : 'c'}">${data[i].level}</td>
            <td class="${condition ? 'g' : 'd'}">${condition ? "-" : data[i].remainsaosp}</td>
            <td class="${condition ? 'g' : 'e'}">${condition ? "-" : data[i].remainsgosp}</td></tr>`
      rows = rows + row;
    };
    var contentHtml = `${style}
        <h1>${filename}</h1>
        <table><tbody><tr>
        <th>S.no</th>
        <th>Name</th>
        <th>Level</th>
        <th>SAO</th>
        <th>SGO</th>
        </tr>${rows}</tbody></table>`
  } else {
    let Dates = [];
    let cheque = [];
    data.forEach(el => {
      el.data.forEach(ele => {
        Dates.push(ele.paydate);
      })
    });
    Dates = [...new Set(Dates)]
    let elem = "";
    for (let i = 0; i < 4; i++) {
      elem = elem + `<th>${Dates[i]}</th>`
    }
    let rows = "";
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < 4; j++) {
        cheque[j] = 0;
        data[i].data.forEach(el => {
          if (el.paydate == Dates[j]) {
            cheque[j] = cheque[j] + Number(el.amount)
          }
        })
      }
      let c = (data[i].level == "null" || data[i].level == "!Pass!");
      let row = `<tr>
            <td>${i + 1}</td>
            <td class="${c ? 'g' : 'a'}">${data[i].name}</td>
            <td class="${c ? 'g' : 'd'}">${data[i].level}</td>
            <td class="${c ? 'g' : (cheque[0] ? "e" : "b")}">${c ? '-' : cheque[0]}</td>
            <td class="${c ? 'g' : (cheque[1] ? "e" : "b")}">${c ? '-' : cheque[1]}</td>
            <td class="${c ? 'g' : (cheque[2] ? "e" : "b")}">${c ? '-' : cheque[2]}</td>
            <td class="${c ? 'g' : (cheque[3] ? "e" : "b")}">${c ? '-' : cheque[3]}</td>
            </tr>`
      rows = rows + row;
    };
    var contentHtml = `${style}
            <h1>${filename}</h1>
            <table><tbody><tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Level</th>
            ${elem}
            </tr>${rows}</tbody></table>`
  }
  await page.setContent(contentHtml);
  if (data.length >= 30) {
    await page.emulateMediaType('screen');
    await page.pdf({
      format: 'A4',
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      printBackground: true,
      path: path.join(__dirname, './out/', filename + '.pdf')
    });
  } else {
    await page.screenshot({ path: path.join(__dirname, './out/', filename + '.png'), fullPage: 'true' });
  }
  await browser.close();
};
(async () => {
  console.log(colors.yellow.bold("-- FETCHING TEAMS DATA --"));
  // for now Editing - https://www.npoint.io/docs/0e0d3d92fb2de77c62b0
	const res = await fetch(`https://api.npoint.io/0e0d3d92fb2de77c62b0`);
	const Data = JSON.parse(await res.text());
	fs.writeFileSync('./Data.json',JSON.stringify(Data , undefined ,2));
  console.clear();
  await outFile();
  setting.WelcomeLogo ? await WelcomeLogo() : "";
  const TeamsOPT = [];
  Data.forEach(el => {
    TeamsOPT.push(el.name);
  })
  const { Teams } = await inquirer.prompt({ // asking for which team to use
    type: 'checkbox',
    name: 'Teams',
    message: colors.yellow('Select Teams ?'),
    choices: TeamsOPT,
    loop: true,
    pageSize: 15,
  });
  if (Teams.length == 0) {
    console.log(`${colors.red('-ERROR- :')} ${colors.yellow("Please Select Team")}`);
    return
  };
  const { func } = await inquirer.prompt({ // asking for which data to Fetch
    type: 'checkbox',
    name: 'func',
    message: colors.yellow('Select Command ?'),
    choices: ['Level Data', 'Target Data', 'Cheque Data', 'Password Checker', 'Editor'],
    loop: true,
    pageSize: 10
  });
  if (func.length == 0) {
    console.log(`${colors.red('-ERROR- :')} ${colors.yellow("Please Select Func")}`);
    return
  }
  if (func.includes("Editor")) {

  }
  for (let i = 0; i < Teams.length; i++) { // loop for every team
    for (let j = 0; j < Data.length; j++) {
      if (Data[j].name == Teams[i]) {
        const data = Data[j].data; // reading team Json
        console.log(colors.dim(Terminator));
        console.log(colors.magenta("FILE NBR : ") + colors.yellow(i + 1) + '/' + colors.yellow(Teams.length));
        console.log(colors.magenta(Teams[i].toString().toUpperCase()) + ' : ' + colors.yellow(data.length));
        console.log(colors.dim(Terminator));
        await mine(data, func, Teams[i]); // atual Data Fetch
      }
    }
  }
  if (func != 'Password Checker' || Teams == [] || func == []) {
    Power.execSync('start ' + path.join(__dirname, '/out'));
  }
  console.log(colors.dim(Terminator));
  console.log(colors.green.bold('PROCESS COMPLETED'));
  console.timeEnd('Time Taken ');
})();