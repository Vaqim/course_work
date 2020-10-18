window.onload = () => {

    let X1, X2, Iters;
    let iterations = [10, 20, 50, 100, 1000];
    document.getElementById('methods').hidden = true;
    let a = 0.4;

    function changeA(parameter){
        if (parameter === 0.4){
            a = 0.8;
            return a;
        }
        if (parameter === 0.8){
            a = 0.4;
            return a;
        }
    }

    function f(x){
        return 1 + Math.pow(Math.E, -x);
    }

    function F(x){
        return x - Math.pow(Math.E, -x);
    }

    function analitical(start, end){
        let result = F(end) - F(start); 
        return result;
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
                radius: 3,
                order: 0,
                backgroundColor: `rgba(4, 99, 7, ${changeA(a)})`
            })
            start = end;
        }
        return dataSets;
    }

    function tRectangle(min, max, iters){
        let area = 0;
        let d = (max - min) / iters;
        let start = min;
        
        for (let i = 0; i < iters; i++){
            let end = start + d;
            let mid = (start + end) / 2;
            area += d * f(mid);
            start = end;
        }
        return area;
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
                backgroundColor: `rgba(4, 99, 7, ${changeA(a)})`
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
            backgroundColor: 'rgba(4, 99, 7, 0.6)'
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

    function tMonteCarlo(min, max, dots){
        let goodDots = 0;
        let yMin = 0;
        let yMax = 4;

        let area = (yMax - yMin) * (max - min);

        for (let i = 0; i < dots; i++){
            let x = getRandomArbitrary(min, max);
            let y = getRandomArbitrary(yMin, yMax);
            if(f(x) >= y) {
                goodDots++;
                continue;
            }
        }
        return (goodDots / dots) * area;
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

    document.getElementById('main').addEventListener('click', () => {
        X1 = +document.getElementById('x1').value;
        X2 = +document.getElementById('x2').value;
        Iters = +document.getElementById('numberOfIters').value;

        let alerts = document.getElementById('mainAlertField');

        alerts.textContent = '';
        alerts.className = '';

        if(X1 >= X2) {
            alerts.textContent = 'X1 >= X2';
            alerts.className = 'error';
            return false;
        }
        document.getElementById('methods').hidden = false;

        let analit = analitical(X1, X2);
        document.getElementById('analitical').innerHTML = `На проміжку [${X1}, ${X2}]<br>Площа криволінійної трапеції: ${analit.toFixed(4)}`;
        
        let methods = ['rect', 'trap', 'mc'];

        for (method of methods){
            document.getElementById(`${method}An`).textContent = analit.toFixed(5);
        }
        
        
        for(iter of iterations){
            const rect = tRectangle(X1, X2, iter);
            const trap = trapezoid(X1, X2, iter);
            const mc = tMonteCarlo(X1, X2, iter);

            const absRect = Math.abs(analit - rect);
            const absTrap = Math.abs(analit - trap);
            const absMc = Math.abs(analit - mc);

            document.getElementById(`rect${iter}`).textContent = rect.toFixed(5);
            document.getElementById(`rectAbs${iter}`).textContent = absRect.toFixed(5);
            document.getElementById(`rectRel${iter}`).textContent = `${((absRect / analit) * 100).toFixed(2)}%`;

            document.getElementById(`trap${iter}`).textContent = trap.toFixed(5);
            document.getElementById(`trapAbs${iter}`).textContent = absTrap.toFixed(5);
            document.getElementById(`trapRel${iter}`).textContent = `${((absTrap / analit) * 100).toFixed(2)}%`;

            document.getElementById(`mc${iter}`).textContent = mc.toFixed(5);
            document.getElementById(`mcAbs${iter}`).textContent = absMc.toFixed(5);
            document.getElementById(`mcRel${iter}`).textContent = `${((absMc / analit) * 100).toFixed(2)}%`;
        }

        drawRect(X1, X2, Iters);
        drawTrap(X1, X2, Iters);
        drawSim(X1, X2, Iters);
        drawMontecarlo(X1, X2, Iters);
    });

    document.getElementById('refreshMonteCarlo').addEventListener('click', () => {
        let analit = analitical(X1, X2);
        
        for (iter of iterations){
            const mc = tMonteCarlo(X1, X2, iter);
            const absMc = Math.abs(analit - mc);

            document.getElementById(`mc${iter}`).textContent = mc.toFixed(5);
            document.getElementById(`mcAbs${iter}`).textContent = absMc.toFixed(5);
            document.getElementById(`mcRel${iter}`).textContent = `${((absMc / analit) * 100).toFixed(2)}%`;
        }
    });

    const drawRect = (x1, x2, iters) => {
        let alerts = document.getElementById('rectangleAlertField');

        alerts.textContent = '';
        alerts.className = '';

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
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
            }
        });
    }

    const drawTrap = (x1, x2, iters) => {
        const ctx = document.getElementById('trap').getContext('2d');

        let alerts = document.getElementById('trapAlertField');
        alerts.textContent = '';
        alerts.className = '';

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
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
            }
        });
    }

    const drawSim = (x1, x2, iters) => {
        const ctx = document.getElementById('simpson').getContext('2d');

        let alerts = document.getElementById('simpsonAlertField');
        alerts.textContent = '';
        alerts.className = '';

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
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
            }
        });
    }

    const drawMontecarlo = (x1, x2, dots) => {
        let alerts = document.getElementById('montecarloAlertField');
        alerts.textContent = '';
        alerts.className = '';

        const ctx = document.getElementById('montecarlo').getContext('2d');

        const [dataSet, area] = monteCarlo(x1, x2, dots);

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

};