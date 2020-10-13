window.onload = () => {

    let x1, x2;

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
                label: "",
                function: ()=>{},
                data: [{
                    x: +start.toFixed(2),
                    y: +f(start).toFixed(2)
                },{
                    x: +end.toFixed(2),
                    y: +f(end).toFixed(2)
                }],
                borderColor: "green",
                fill: true,
                radius: 0,
                order: 0,
                backgroundColor: 'rgba(117, 190, 218, 0.7)'
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
                label: "",
                function: ()=>{},
                data: [{
                    x: +start.toFixed(2),
                    y: +f((start + end) / 2).toFixed(2)
                },{
                    x: +end.toFixed(2),
                    y: +f((start + end) / 2).toFixed(2)
                }],
                borderColor: "green",
                fill: true,
                radius: 0,
                order: 0,
                backgroundColor: 'rgba(117, 190, 218, 0.7)'
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

    function simpsonDraw(min, max, iters){
        let d = (max - min) / iters;
        let start = min;
        let dataSet = {
            label: "",
            function: ()=>{},
            data: [], 
            borderColor: "green",
            fill: true,
            radius: 3,
            order: 0,
            backgroundColor: 'rgba(117, 190, 218, 0.6)'
        };

        for (let i = 0; i < iters; i++){
            let end = start + d;
            
            dataSet.data.push({
                x: +start.toFixed(2),
                y: +f(start).toFixed(2)
            });
            start = end;
        }
        dataSet.data.push({
            x: +start.toFixed(2),
            y: +f(start).toFixed(2)
        });

        return dataSet;
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
                    label: "",
                    function: function(){},
                    data: [{
                        x: +x.toFixed(2),
                        y: +y.toFixed(2)
                    }],
                    borderColor: "green",
                    fill: false,
                    radius: 2,
                    borderWidth: 4,
                    order: 0
                });
                continue;
            }
            dotsDatasets.push({
                label: "",
                function: function(){},
                data: [{
                    x: +x.toFixed(2),
                    y: +y.toFixed(2)
                }],
                borderColor: "black",
                fill: false,
                radius: 2,
                borderWidth: 4,
                order: 0
            });

        }
        return [dotsDatasets, (goodDots / dots) * area];
    }

    document.getElementById('drawMain').addEventListener('click', () => {
        x1 = +document.getElementById('x1').value;
        x2 = +document.getElementById('x2').value;
        let alerts = document.getElementById('mainAlertField');
        alerts.textContent = '';
        alerts.className = '';

        if(x1 >= x2) {
            alerts.textContent = 'X1 >= X2';
            alerts.className = 'error';
            return false;
        }

        const ctx = document.getElementById('main').getContext('2d');

        let data = {
            labels: getArrayRange(x1, x2, 0.1),
            datasets: [{
                label: "f(x) ",
                function: f,
                data: [],
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
        const iters = +document.getElementById('rectangleIters').value;
        let alerts = document.getElementById('rectangleAlertField');

        alerts.textContent = '';
        alerts.className = '';

        if(x1 >= x2) {
            alerts.textContent = 'X1 >= X2';
            alerts.className = 'error';
            return false;
        }

        if (iters <= 0){
            alerts.textContent = 'Не вірна кількість ітерацій';
            alerts.className = 'error';
            return false;
        }

        const ctx = document.getElementById('rectangle').getContext('2d');

        let data = {
            labels: getArrayRange(x1, x2, 0.01),
            datasets: [{
                label: "f(x) ",
                function: f,
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            }]
        }

        const [result, area] = rectangle(x1, x2, iters);
        data.datasets = data.datasets.concat(result);

        alerts.textContent = `Площа криволінійної трапеції: ${area.toFixed(4)}`;
        alerts.className = 'success';
            
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
        const iters = +document.getElementById('trapIters').value;
        const ctx = document.getElementById('trap').getContext('2d');

        let alerts = document.getElementById('trapAlertField');
        alerts.textContent = '';
        alerts.className = '';

        if(x1 >= x2) {
            alerts.textContent = 'X1 >= X2';
            alerts.className = 'error';
            return false;
        }

        if (iters <= 0){
            alerts.textContent = 'Не вірна кількість ітерацій';
            alerts.className = 'error';
            return false;
        }

        let data = {
            labels: getArrayRange(x1, x2, 0.01),
            datasets: [{
                label: "f(x) ",
                function: f,
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            }]
        }
        const area = trapezoid(x1, x2, iters);
        const result = trapDraw(x1, x2, iters);

        data.datasets = data.datasets.concat(result);

        alerts.className = 'success';
        alerts.textContent = `Площа криволінійної трапеції: ${area.toFixed(4)}`;

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
        const iters = +document.getElementById('simpsonIters').value;
        const ctx = document.getElementById('simpson').getContext('2d');

        let alerts = document.getElementById('simpsonAlertField');
        alerts.textContent = '';
        alerts.className = '';

        if(x1 >= x2) {
            alerts.textContent = 'X1 >= X2';
            alerts.className = 'error';
            return false;
        }

        if (iters <= 0){
            alerts.textContent = 'Не вірна кількість ітерацій';
            alerts.className = 'error';
            return false;
        }

        let data = {
            labels: getArrayRange(x1, x2, 0.01),
            datasets: [{
                label: "f(x) ",
                function: f,
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            }]
        }

        const area = simpson(x1, x2, iters);
        const result = simpsonDraw(x1, x2, iters);

        data.datasets = data.datasets.concat(result);

        alerts.className = 'success';
        alerts.textContent = `Площа криволінійної трапеції: ${area.toFixed(4)}`;

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
        const dots = +document.getElementById('amountOfDots').value;

        let alerts = document.getElementById('montecarloAlertField');
        alerts.textContent = '';
        alerts.className = '';

        if(x1 >= x2) {
            alerts.textContent = 'X1 >= X2';
            alerts.className = 'error';
            return false;
        }

        if (dots <= 0){
            alerts.textContent = 'Не вірна кількість точок';
            alerts.className = 'error';
            return false;
        }

        const ctx = document.getElementById('montecarlo').getContext('2d');

        const [dataSet, area] = monteCarlo(x1, x2, dots);
        console.table(dataSet);

        let data = {
            labels: getArrayRange(x1, x2, 0.01),
            datasets: [{
                label: "f(x) ",
                function: f,
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            }]
        }
        console.log(dataSet);
        data.datasets = data.datasets.concat(dataSet);

        alerts.className = 'success';
        alerts.textContent = `Площа криволінійної трапеції: ${area.toFixed(4)}`;

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
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
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