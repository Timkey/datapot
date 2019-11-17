var access = function(path='', data={})
{
  this.path = path;
  this.data = JSON.stringify(data);

}

access.prototype.get = async function()
{
  let path = this.path;

  if (path.length > 0)
  {
      this.url = "/" + path;
  }
  var j = await $.ajax({
      type: "GET",
      url: this.url,
      contentType: 'application/json'
  });

  this.data = j['data'];
  //console.log(this.data);
}

access.prototype.post = async function()
{
  let path = this.path;
  let data = this.path;

  if (path.length > 0)
  {
      this.url = "/" + path;
  }

  var j = await $.ajax({
      type: "POST",
      url: this.url,
      data: this.data,
      contentType: 'application/json'
  });

  this.data = j['data'];
  //console.log('working');
}

/*
* accessing graphng data
*/

var grapher = function()
{
  this.groups = {};
  this.questions = [];
  this.payLoad = {};
  this.dist = {};
  this.targetQuestions = {};
  this.html = "";
}

grapher.prototype.scoper = async function(id='', choice=-1)
{
  /*
  * refresh store
  */

  this.targetQuestions = {};
  this.html = "";

  if (choice > -1)
  {
    let val = document.getElementById(id).value;
    let qs = this.questions[choice];
    let ch = this.groups[qs][val];
    this.payLoad[qs] = ch;
    
    //let message = "proxima alert ("+id+", "+choice+", "+val+", "+ch+")";
    
    //alert(message);
    //console.log(message);
    //console.log(this.groups);
    //console.log(this.payLoad);
  }
  else if(choice == -1)
  {
    let qs = this.questions[choice];
    this.payLoad[qs] = "false";
    //console.log(this.payLoad);
  }

  await this.access();
}

grapher.prototype.access = async function()
{
  let pld = {};

  for (let x = 0; x < this.questions.length; x++)
  {
    let qs = this.questions[x];

    if (this.payLoad[qs] !== undefined && this.payLoad[qs] != 'false')
    {
      pld[qs] = this.payLoad[qs];
    }
  }

  //console.log(pld);
  /*
  * loading filtered distro
  */

  let ac = new access(path='filter', data = {'filter' : this.payLoad});
  await ac.post();
  this.dist = await ac.data;
  console.log(this.dist);

  let keys = Object.keys(this.dist);
  await this.processFilter(obKeys=keys);
  await this.render(obKeys=Object.keys(this.targetQuestions));
}

grapher.prototype.processFilter = async function(obKeys=[], id=0)
{
  //console.log(obKeys);
  let question = obKeys[id];
  let items = Object.keys(this.dist[question]);
  if(items.length > 1)
  {
    
    this.targetQuestions[id] = question;

    /*
    * prep docking area for graphs
    */

    let template = '';

    template += '<hr>';
    template += '<h2>'+question+'</h2>';
    template += '<div class="row">';
    template += '<div class="col-md-6 col-sm-12">';
    template += '<div class="card card-default ">';
    template += '<div class="card-body" id="pie'+id+'"></div>';
    template += '<div class="card-header">Pie Chart</div>';
    template += '</div>';
    template += '</div>';
    template += '<div class="col-md-6 col-sm-12">';
    template += '<div class="card card-default">';
    template += '<div class="card-body" id="bar'+id+'"></div>';
    template += '<div class="card-header">Bar Chart</div>';
    template += '</div>';
    template += '</div>';
    template += '</div>';

    this.html += template;
  }

  id++;
  if(id < obKeys.length)
  {
    await this.processFilter(obKeys, id);
  }
  else
  {
    /*
    * render works
    */

    $('#graphs').html(this.html);
  }
}

grapher.prototype.render = async function(obKeys=[], ad=0)
{
  //console.log(obKeys);
  let id = obKeys[ad];
  let question = this.targetQuestions[id];
  let tmp = this.dist[question];
  let groups = Object.keys(tmp);
  let groupData = [];


  for (let x=0; x < groups.length; x++)
  {
    let key = groups[x];
    let val = tmp[key];

    groupData.push(val);
  }

  await this.pieplot(groups, groupData, 'pie'+id);
  await this.barplot(groups, groupData, 'bar'+id);

  //terminal logic
  ad++;

  if(ad < obKeys.length)
  {
    await this.render(obKeys, ad);
  }
}

grapher.prototype.pieplot = async function(groups=[], groupData=[], dock="")
{
  var data = [{
    type: "pie",
    values: groupData,
    labels: groups,
    //textinfo: "label+percent",
    textposition: "outside",
    automargin: true,
    hole: .6
  }]

  var layout = {
    height: 300,
    width: 370,
    margin: {"t": 0, "b": 0, "l": 0, "r": 0},
    showlegend: true
    }

  Plotly.newPlot(dock, data, layout);
}

grapher.prototype.barplot = async function(groups=[], groupData=[], dock="")
{
  var dataBar = [{
    type: 'bar',
    x: groupData,
    y: groups,
    orientation: 'h'
  }];

  var layout = {
    height: 300,
    width: 320,
    margin: {"t": 0, "b": 15, "l": 100, "r": 0},
    showlegend: false
  }

  Plotly.newPlot(dock, dataBar, layout);
}



/*
* generating select tags corresponding to questions
*/

let graph = new grapher();

var select = function(dock='')
{
  this.lock = false;
  this.dropOptions = {};
  this.html = "";
  if (dock.length > 0)
  {
    this.dock = dock;
    $('#'+dock).html("Loading ...");
  }
  else
  {
    this.lock = true;
  }
}

select.prototype.compose = async function()
{
  await this.questions();
  await this.render();
  graph.groups = this.dropOptions;
}

select.prototype.questions = async function()
{
  if (this.lock == false)
  {
    let qs = new access(path='questions');
    await qs.get();
    let questions = qs.data;

    await this.loopQuestions(each=0, questions=questions);

    //console.log(this.dropOptions);
  }
  else
  {
    console.log('Module locked');
  }
}

select.prototype.loopQuestions = async function(each=0, questions=[])
{
  if (questions.length > 0)
  {
    /*
    * loading each questions to dropOpts
    */

    let address = questions[each];
    graph.questions.push(address);

    this.dropOptions[address] = [];

    /*
    * API call to groups per question
    */

    let call = new access(path='groups', {'question':address});
    await call.post();
    let groups = call.data;
    this.dropOptions[address] = groups;

    let options = "";
    options += await this.loopGroups(options="", every=0, groups=groups);

    this.html += await this.generate(label=address, options=options, id=each);


    each++;

    if (each < questions.length)
    {
      await this.loopQuestions(each, questions);
    }
  }
}

select.prototype.loopGroups = async function(options="", every=0, groups=[])
{
  if (groups.length > 0)
    {
      /*
      * generating options list
      */

      options += "<option value='"+every+"' >"+groups[every]+"</option>";
      every++;

      if (every < groups.length)
      {
        return await this.loopGroups(options=options, every=every, groups=groups);
      }
      else
      {
        return options;
      }
      
    }
}

select.prototype.generate = async function(label='', options='', id=-1)
{
  let idd = "flog_"+id;

  let template = "";
  template += "<div class='select-outline'>";
  template += "<label>"+label+"</label>";
  template += "<select class='browser-default custom-select' onchange=\"graph.scoper('"+idd+"', "+id+");\" id='"+idd+"'>";
  template += "<option value='-1'>OFF</option>";
  template += options;
  template += "</select>";
  template += "</div>";

  //console.log(options);

  return template;
}

select.prototype.render = async function()
{
  /*
  * html view reload
  */

  $('#'+this.dock).html(this.html);
}

let test = new select(dock='dock-select');
test.compose();

graph.pieplot(['carbohydrates', 'proteins', 'vitamins'], [12, 45, 65], 'test');
graph.barplot(['carbohydrates', 'proteins', 'vitamins'], [12, 45, 65], 'test1');

graph.pieplot(['carbohydrates', 'proteins', 'vitamins', 'minerals'], [12, 45, 65, 25], 'test2');
graph.barplot(['carbohydrates', 'proteins', 'vitamins', 'minerals'], [12, 45, 65, 25], 'test3');