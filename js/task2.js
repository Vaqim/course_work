window.onload = function(){
    let X1, X2;
    let dataSet = [{
        h: 2,
        w: 1,
        e: 5.3,
    },{
        h: 0.5,
        w: 0.2,
        e: 4.8,
    },{
        h: 1,
        w: 0.3,
        e: 5.5,
    },{
        h: 0.5,
        w: 0.4,
        e: 3.5,
    },{
        h: 0.5,
        w: 0.1,
        e: 4.3,
    },{
        h: 1,
        w: 0.3,
        e: 4.8,
    },];
    let dataSetNumber;

    document.getElementById('methodSection').hidden = true;

    function roundInt(integer){
        return (Math.round(integer * 10000) / 10000);
    }

    function getArrayRange(start, end, step){
        let result = [];
        for (let i = start; i <= end; i += step){
            result.push(+i.toFixed(3));
        }
        return result;
    }

    function f(h, w, e1) {
        return (e1 + 1) / 2 * (1 + ((e1 - 1) / (e1 + 1)) * (Math.log(Math.PI / 2) + (Math.log(Math.PI / 4) / e1) / Math.log((8 * h) / w)));
    }

    function duhotFunc(start, end, h, w, e, iterations) {
        let results = {
            green: {},
            center: {},
            red: {}
        };
        let center;
        
        for(let i = 0; i < iterations - 1; i++) {
            center = (start + end) / 2;
            if(Math.abs((f(h, w, center) - e) * (f(h, w, end) - e)) === Infinity){
                end = center;
                continue;
            }
            if((f(h, w, center) - e) * (f(h, w, end) - e) <= 0){
                start = center;
            } else {
                end = center;
            }
        }

        results.center.x = ((start + end) / 2);
        results.center.y = (f(h, w, (start + end) / 2));

        if((f(h, w, (start + end) / 2) - e) * (f(h, w, end) - e) <= 0){
            results.green.x = end;
            results.green.y = f(h, w, end);
            results.red.x = start;
            results.red.y = f(h, w, start);
        } else if((f(h, w, (start + end) / 2) - e) * (f(h, w, start) - e) <= 0) {
            results.green.x = start;
            results.green.y = f(h, w, start);
            results.red.x = end;
            results.red.y = f(h, w, end);
        } else {
            return false;
        }
        return results;
    }

    function iteratorFunc(a, b, h, w, e, n) {
        let result = {
            start: {},
            end: {}
        };

        for (let i = a; i < b; i += n){
            let j = i;

            if(Math.abs((f(h, w, j) - e) - (f(h, w, j + n) - e )) >= n * 100) continue;

            if (f(h, w, j) === e || (f(h, w, j) - e) * (f(h, w, j + n) - e) < 0) {
                result.start.y = j;
                result.start.x = f(h, w, j);
                result.end.y = j + n;
                result.end.x = f(h, w, j + n);
                return result;
            }
        }
        return false;
    }

    document.getElementById('drawMain').addEventListener('click', () => {
        X1 = +document.getElementById('x1').value;
        X2 = +document.getElementById('x2').value;
        let alertField = document.getElementById('mainAlertField');

        alertField.textContent = '';
        alertField.className = '';

        for (let i = 1; i <= 6; i++){
            if (document.getElementById(`set${i}`).checked){
                dataSetNumber = i - 1;
                break;
            }
        }

        if(X1 >= X2){
            alertField.textContent = 'Невірний проміжок (X1 >= X2)';
            alertField.className = 'error';
            return false;
        }

        document.getElementById('methodSection').hidden = false;

        const ctx = document.getElementById('main').getContext('2d');

        let data = {
            labels: getArrayRange(X1, X2, 0.001),
            datasets: [{
                label: "f(x) ",
                function: function(x) { return +f(dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, x).toFixed(3) },
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                spanGaps: false,
            }]
        }

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

    document.getElementById('drawIter').addEventListener('click', () => {
        let alertField = document.getElementById('iterAlertField');
        let step = +document.getElementById('iterStep').value;
        alertField.textContent = '';

        if (X1 >= X2) {
            alertField.className = 'error';
            alertField.textContent = 'Не вірний проміжок (X1 >= X2)';
            return false;
        }

        if (step <= 0){
            alertField.className = 'error';
            alertField.textContent = 'Не вірний крок';
            return false;
        }
        
        let results = iteratorFunc(X1, X2, dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, dataSet[dataSetNumber].e, step);
        if (!results){
            alertField.className = 'warning';
            alertField.textContent = 'Коренів не знайдено';
            return false;
        }
        let root = (results.end.y + results.start.y) / 2;
        alertField.className = 'success';
        alertField.textContent = `Корінь: ${roundInt(root)}`;

        const ctx = document.getElementById('iter').getContext('2d');

        let data = {
            labels: getArrayRange(X1, X2, 0.001),
            datasets: [{
                label: "f(x) ",
                function: function(x) { return +f(dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, x).toFixed(3) },
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            },
            {
                label: "Корінь",
                function: () => {},
                data: [{
                    x: +(results.start.y).toFixed(2),
                    y: +(results.start.x).toFixed(2)
                },
                {
                    x: +(results.end.y).toFixed(2),
                    y: +(results.end.x).toFixed(2)
                }],
                borderColor: "green",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 2
            }]
        }

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

    document.getElementById('drawDuhot').addEventListener('click', () => {
        
        const iters = +document.getElementById('duhotIters').value;
        let alertField = document.getElementById('duhotAlertField');
        alertField.textContent = '';
        alertField.className = '';

        if(iters <= 0) {
            alertField.className = 'error';
            alertField.textContent = 'Не корректна кількість ітерацій'
            return false;
        }

        let results = duhotFunc(X1, X2, dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, dataSet[dataSetNumber].e, iters);

        if(!results) {
            alertField.className = 'warning';
            alertField.textContent = 'Коренів не знайдено';
            return false;
        }
        alertField.className = 'success';
        let root = (results.green.x + results.center.x) / 2;
        alertField.textContent = `Корінь: ${roundInt(root)}`;

        const ctx = document.getElementById('duhot').getContext('2d');

        let data = {
            labels: getArrayRange(X1, X2, 0.001),
            datasets: [{
                label: "f(x) ",
                function: x => {return +f(dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, x).toFixed(3)},
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            },{
                label: "Корінь",
                function: () => {},
                data: [{
                    x: +(results.green.x).toFixed(2),
                    y: +(results.green.y).toFixed(2)
                },
                {
                    x: +(results.center.x).toFixed(2),
                    y: +(results.center.y).toFixed(2)
                }],
                borderColor: "green",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 2,
            },{
                label: "Не корінь",
                function: () => {},
                data: [{
                    x: +(results.red.x).toFixed(2),
                    y: +(results.red.y).toFixed(2)
                },
                {
                    x: +(results.center.x).toFixed(2),
                    y: +(results.center.y).toFixed(2)
                }],
                borderColor: "red",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 2,
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
