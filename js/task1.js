window.onload = function() {
    
    function f(x) {
        //return Math.pow(x, 2) - Math.log(x);
        return Math.pow(x, 2) - Math.cos(x);
    }

    function F(x) {
        //return 2 * x + (-1 / x);
        return 2 * x + Math.sin(x);
    }

    function iteratorFunc(a, b, n) {
        let result = [{}, {}];

        for (let i = a; i < b; i += n){

            let j = +i.toFixed(2);
            if (f(j) === 0 || f(j) * f(j + n) < 0) {
                result[0].x = j;
                result[0].y = f(j);
                result[1].x = j + n;
                result[1].y = f(j + n);
                return result;
            }
        }
        return false;
    }

    function duhotFunc(start, end, iterations) {
        let results = {
            green: {},
            center: {},
            red: {}
        };
        let center;

        for(let i = 1; i < iterations; i++) {

            center = (start + end) / 2;

            if(f(center) * f(end) <= 0){
                start = center;
            } else {
                end = center;
            }
        }

        results.center.x = +((start + end) / 2).toFixed(2);
        results.center.y = +f((start + end) / 2).toFixed(2);

        if(f((start + end) / 2) * f(end) <= 0){
            results.green.x = +(end).toFixed(2);
            results.green.y = +f(end).toFixed(2);
            results.red.x = +(start).toFixed(2);
            results.red.y = +f(start).toFixed(2);
        } else if(f((start + end) / 2) * f(start) <= 0) {
            results.green.x = +(start).toFixed(2);
            results.green.y = +f(start).toFixed(2);
            results.red.x = +(end).toFixed(2);
            results.red.y = +f(end).toFixed(2);
        } else {
            return false;
        }
        return results;
    }

    function getArrayRange(start, end, step){
        let result = [];
        for (let i = start; i <= end; i += step){
            result.push(+i.toFixed(2));
        }
        return result;
    }

    function newtonFunc(start, end, step){

        let result = [];
        let counter = 1;

        let first = start;

        while( Math.abs(f(end)) > step ){
            counter++;
            let buffer = end;
            end += (-f(end) / F(end));
            if (end < start) return false;

            result.push({
                label: `дотична ${counter}`, // Name it as you want
                function: () => {},
                data: [{
                    x: +(buffer).toFixed(2),
                    y: +(f(buffer)).toFixed(2)
                },
                {
                    x: +(end).toFixed(2),
                    y: 0
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "red",
                borderWidth: 2,
                order: 0,
                fill: false,
                radius: 0,
                order: 0
            }, {
                label: '', // Name it as you want
                function: () => {},
                data: [
                {
                    x: +(end).toFixed(2),
                    y: 0
                },
                {
                    x: +(end).toFixed(2),
                    y: +(f(end).toFixed(2))
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "green",
                borderWidth: 2,
                order: 0,
                fill: false,
                radius: 0,
                order: 0
            });


            
            console.log(`end: ${end}`)
            console.log(`buffer: ${buffer}`);
            console.log('***')
        }

        console.log(`finished end: ${end}`);


        return result;
    }

    document.getElementById('drawMain').addEventListener('click', () => {

        let x1 = +document.getElementById('x1Main').value || 0;
        let x2 = +document.getElementById('x2Main').value || 0;


        if (x1 >= x2) throw new Error('x1 >= x2');

        const ctx = document.getElementById('main').getContext('2d');

        let data = {
            labels: getArrayRange(x1, x2, 0.1),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: f,
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0
            }]
        }

        Chart.pluginService.register({
            beforeInit: function(chart) {
                // We get the chart data
                let data = chart.config.data;
        
                // For every dataset ...
                for (let i = 0; i < data.datasets.length; i++) {
        
                    // For every label ...
                    for (let j = 0; j < data.labels.length; j++) {
        
                        // We get the dataset's function and calculate the value
                        let fct = data.datasets[i].function,
                            x = data.labels[j],
                            y = fct(x);
                        // Then we add the value to the dataset data
                        data.datasets[i].data.push(y);
                    }
                }
            }
        });

        let myBarChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        
    });

    document.getElementById('drawIter').addEventListener('click', () => {

        let x1 = +document.getElementById('x1Main').value || 0;
        let x2 = +document.getElementById('x2Main').value || 0;

        let step = +document.getElementById('stepIter').value || 0.1;

        if (x1 >= x2) throw new Error('x1 >= x2');
        if (step <= 0) throw new Error('negative step');

        const ctx = document.getElementById('iter').getContext('2d');

        let results = iteratorFunc(x1, x2, step);
        
        if(!results) return;

        let data = {
            labels: getArrayRange(x1, x2, step),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: f,
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            },
            {
                label: "Корінь", // Name it as you want
                function: () => {},
                data: [{
                    x: +(results[0].x).toFixed(2),
                    y: +(results[0].y).toFixed(2)
                },
                {
                    x: +(results[1].x).toFixed(2),
                    y: +(results[1].y).toFixed(2)
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "green",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 0
            }]
        }

        Chart.pluginService.register({
            beforeInit: function(chart) {
                // We get the chart data
                let data = chart.config.data;
        
                // For every dataset ...
                for (let i = 0; i < data.datasets.length; i++) {
        
                    // For every label ...
                    for (let j = 0; j < data.labels.length; j++) {
        
                        // We get the dataset's function and calculate the value
                        let fct = data.datasets[i].function,
                            x = data.labels[j],
                            y = fct(x);
                        // Then we add the value to the dataset data
                        data.datasets[i].data.push(y);
                    }
                }
            }
        });

        let myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        
    });

    document.getElementById('drawDuhot').addEventListener('click', () => {

        let x1 = +document.getElementById('x1Main').value || 0;
        let x2 = +document.getElementById('x2Main').value || 0;

        let numberOfIters = document.getElementById('numberOfItersDuhot').value || 0;

        if (x1 >= x2) throw new Error('x1 >= x2');
        if (numberOfIters <= 0) throw new Error('negative step');

        const ctx = document.getElementById('duhot').getContext('2d');

        let results = duhotFunc(x1, x2, numberOfIters);
        console.log(results);
        if( results === false ) return;
        

        let data = {
            labels: getArrayRange(x1, x2, 0.01),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: f,
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            },{
                label: "Корінь", // Name it as you want
                function: () => {},
                data: [{
                    x: results.green.x,
                    y: results.green.y
                },
                {
                    x: results.center.x,
                    y: results.center.y
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "green",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 0,
                order: 0
            },{
                label: "Не корінь", // Name it as you want
                function: () => {},
                data: [{
                    x: results.red.x,
                    y: results.red.y
                },
                {
                    x: results.center.x,
                    y: results.center.y
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "red",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 0,
                order: 0
            }]
        }

        Chart.pluginService.register({
            beforeInit: function(chart) {
                // We get the chart data
                let data = chart.config.data;
        
                // For every dataset ...
                for (let i = 0; i < data.datasets.length; i++) {
        
                    // For every label ...
                    for (let j = 0; j < data.labels.length; j++) {
        
                        // We get the dataset's function and calculate the value
                        let fct = data.datasets[i].function,
                            x = data.labels[j],
                            y = fct(x);
                        // Then we add the value to the dataset data
                        data.datasets[i].data.push(y);
                    }
                }
            }
        });

        let myBarChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });



    })

    document.getElementById('drawNewton').addEventListener('click', () => {

        let x1 = +document.getElementById('x1Main').value || 0;
        let x2 = +document.getElementById('x2Main').value || 0;

        let step = +document.getElementById('newtonStep').value || 0.5;

        const ctx = document.getElementById('newton').getContext('2d');

        let data = {
            labels: getArrayRange(x1, x2, 0.01),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: f,
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            }]
        }

        let results = newtonFunc(x1, x2, step);

        data.datasets = data.datasets.concat(results);

        Chart.pluginService.register({
            beforeInit: function(chart) {
                // We get the chart data
                let data = chart.config.data;
        
                // For every dataset ...
                for (let i = 0; i < data.datasets.length; i++) {
        
                    // For every label ...
                    for (let j = 0; j < data.labels.length; j++) {
        
                        // We get the dataset's function and calculate the value
                        let fct = data.datasets[i].function,
                            x = data.labels[j],
                            y = fct(x);
                        // Then we add the value to the dataset data
                        data.datasets[i].data.push(y);
                    }
                }
            }
        });

        let myBarChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });



    });
}