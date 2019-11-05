// For a pie chart
var ctx = document.getElementById('myChart').getContext('2d');
var data = {
    datasets: [{
        data: [10, 20, 30],
        backgroundColor:['Red', 'Yellow', 'Blue']
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Red',
        'Yellow',
        'Blue'
    ]
};

var options = {
    title: {
        display: true,
        text: 'What happens when you lend your favorite t-shirt to a girl ?',
        position: 'top'
    },
    rotation: -0.7 * Math.PI
};

var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options
});

// And for a doughnut chart
var ctxx = document.getElementById('myChartt').getContext('2d');
var myDoughnutChart = new Chart(ctxx, {
    type: 'doughnut',
    data: data,
    options: options
});


// getting data from server

var test = function access(path='', data={})
{
    if (path.length > 0)
    {
        this.url = "/" + path;
    }

    this.data = JSON.stringify(data);

    var j = await $.ajax({
        type: "POST",
        url: this.url,
        data: this.data,
        contentType: 'application/json'
      });

      this.data = await j['data'];
      console.log('working');
    


};

test.prototype.log = function()
{
    console.log('testing promise on second function');
    console.log(j.data);
}

var url = 'groups'
var data = {};
data['question'] = "Q10. How long does it take before reloading your mobile data plan after depletion?";

f = new test(url, data);
f.log();