window.onload = () => {
    function f(x){
        return 1 + Math.pow(Math.E, -x);
        // return Math.sin(x)/(1 + Math.pow(x, 2));
    }

    function getArrayRange(start, end, step){
        let result = [];
        for (let i = start; i <= end; i += step){
            result.push(+i.toFixed(2));
        }
        return result;
    }

    function trapDraw(min, max, iters){
        let d = (max - min) / iters;
        let start = min;
        let dataSets = [];
        
        for (let i = 0; i < iters; i++){
            let end = start + d;
            dataSets.push({
                label: "", // Name it as you want
                function: ()=>{},
                data: [{
                    x: +start.toFixed(2),
                    y: +f(start).toFixed(2)
                },{
                    x: +end.toFixed(2),
                    y: +f(end).toFixed(2)
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "green",
                fill: true,
                radius: 0,
                order: 0,
                backgroundColor: 'rgba(117, 190, 218, 0.5)'
            })
            start = end;
        }
        return dataSets;
    }

    function rectangle(min, max, iters){
        let area = 0;
        let d = (max - min) / iters;
        let start = min;
        let dataSets = [];
        
        for (let i = 0; i < iters; i++){
            let end = start + d;
            let mid = (start + end) / 2;
            area += d * f(mid);
            
            dataSets.push({
                label: "", // Name it as you want
                function: ()=>{},
                data: [{
                    x: +start.toFixed(2),
                    y: +f((start + end) / 2).toFixed(2)
                },{
                    x: +end.toFixed(2),
                    y: +f((start + end) / 2).toFixed(2)
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "green",
                fill: true,
                radius: 0,
                order: 0,
                backgroundColor: 'rgba(117, 190, 218, 0.5)'
            })
            start = end;
        }
        return [dataSets, area];
    }

    function trapezoid(min, max, iters){
        let area = (f(min) + f(max)) / 2;
        let height = (max - min) / iters;

        for(let x = min + height; x < max; x += height){
            area += f(x)
        }
        return area * height;
    }

    function simpson(min, max, iters){
        let height = (max - min) / iters;
        let area = (f(min) + f(max)) / 2 + 2 * f(min + height / 2);
        for(let x = min + height; x < max; x += height) {
            area += 2 * f(x + height / 2) + f(x);
        }
        return area * height / 3;
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function monteCarlo(min, max, dots){
        let goodDots = 0;
        let yMin = 0;
        let yMax = 4;
        let dotsDatasets = [];

        let area = (yMax - yMin) * (max - min);

        for (let i = 0; i < dots; i++){
            let x = getRandomArbitrary(min, max);
            let y = getRandomArbitrary(yMin, yMax);
            if(f(x) >= y) {
                goodDots++;
                dotsDatasets.push({
                    label: "", // Name it as you want
                    function: function(){},
                    data: [{
                        x: +x.toFixed(2),
                        y: +y.toFixed(2)
                    }], // Don't forget to add an empty data array, or else it will break
                    borderColor: "green",
                    fill: false,
                    radius: 3,
                    borderWidth: 2,
                });
                continue;
            }
            dotsDatasets.push({
                label: "", // Name it as you want
                function: function(){},
                data: [{
                    x: +x.toFixed(2),
                    y: +y.toFixed(2)
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "black",
                fill: false,
                radius: 3,
                borderWidth: 2,
            });

        }
        return [dotsDatasets, (goodDots / dots) * area];
    }
    /*
    console.log('rectangle ', rectangle(0, 5, 1000));

    console.log('trap ', trapezoid(0, 5, 1000));

    console.log('simpson', simpson(0, 5, 1000));

    console.log('monte Carlo', monteCarlo(0, 5, 20));
    */

    document.getElementById('drawMain').addEventListener('click', () => {
        const x1 = +document.getElementById('x1').value;
        const x2 = +document.getElementById('x2').value;

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

    document.getElementById('drawRectangle').addEventListener('click', () => {
        const x1 = +document.getElementById('x1').value;
        const x2 = +document.getElementById('x2').value;
        const iters = +document.getElementById('rectangleIters').value;
        const ctx = document.getElementById('rectangle').getContext('2d');

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

        const [result, root] = rectangle(x1, x2, iters);
        data.datasets = data.datasets.concat(result);

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
                },
                legend: {
                    display: false
                },
            }
        });
    
    });

    document.getElementById('drawTrap').addEventListener('click', () => {
        const x1 = +document.getElementById('x1').value;
        const x2 = +document.getElementById('x2').value;
        const iters = +document.getElementById('trapIters').value;
        const ctx = document.getElementById('trap').getContext('2d');


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
        const root = trapezoid(x1, x2, iters);
        const result = trapDraw(x1, x2, iters);
        console.log(result);
        console.log(data.datasets);
        data.datasets = data.datasets.concat(result);
        console.log(data.datasets);

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
                },
                legend: {
                    display: false
                },
            }
        });
    });

    document.getElementById('drawSimpson').addEventListener('click', () => {
        const x1 = +document.getElementById('x1').value;
        const x2 = +document.getElementById('x2').value;
        const iters = +document.getElementById('simpsonIters').value;
        const ctx = document.getElementById('simpson').getContext('2d');

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
        
        const root = trapezoid(x1, x2, iters);
        const result = trapDraw(x1, x2, iters);

        data.datasets = data.datasets.concat(result);

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
                },
                legend: {
                    display: false
                },
            }
        });
    });

    document.getElementById('drawMontecarlo').addEventListener('click', () => {
        const x1 = +document.getElementById('x1').value;
        const x2 = +document.getElementById('x2').value;
        const dots = +document.getElementById('amountOfDots').value;

        const ctx = document.getElementById('montecarlo').getContext('2d');

        const [dataSet, root] = monteCarlo(x1, x2, dots);
        console.table(dataSet);
        

        let data = {
            labels: getArrayRange(x1, x2, 0.01),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: f,
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0
            }]
        }
        console.log(dataSet);
        data.datasets = data.datasets.concat(dataSet);

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
                },
                legend: {
                    display: false
                },
            }
        });
    });

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

};