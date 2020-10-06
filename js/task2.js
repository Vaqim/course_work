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

    function roundInt(integer){
        return (Math.round(integer * 10000) / 10000);
    }

    function getArrayRange(start, end, step){
        let result = [];
        for (let i = start; i <= end; i += step){
            result.push(+i.toFixed(2));
        }
        return result;
    }

    function f(h, w, e1) {
        try {    
            const part1 = (e1 + 1) / 2;
            const part2 = 1 + ((e1 - 1) / (e1 + 1));
            const part3 = Math.log(Math.PI / 2) + (Math.log(Math.PI / 4) / e1);
            const part4 = Math.log((8 * h) / w);
            
            return part1 * (part2 * (part3 / part4));
        } catch(e) {
            console.log(e.message);
            return false;
        }
    }

    function duhotFunc(start, end, h, w, e, iterations) {
        let results = {
            green: {},
            center: {},
            red: {}
        };
        let center;

        for(let i = 0; i < iterations; i++) {

            center = (start + end) / 2;

            if((f(h, w, center) - e) * (f(h, w, end) - e) <= 0){
                start = center;
            } else {
                end = center;
            }
            
        }
        // return [start, center, end];

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

    function iteratorFunc(a, b, h, w, e) {
        let result = {
            start: {},
            end: {}
        };
        let n = 0.0001;

        for (let i = a; i < b; i += n){
            let j = i;
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

    document.getElementById('drawIter').addEventListener('click', () => {
        
        X1 = +document.getElementById('x1').value;
        X2 = +document.getElementById('x2').value;
        let alertField = document.getElementById('iterAlertField');
        alertField.textContent = '';

        if (X1 >= X2) {
            alertField.className = 'error';
            alertField.textContent = 'Не корректний проміжок';
            return false;
        }

        for (let i = 1; i <= 6; i++){
            if (document.getElementById(`set${i}`).checked){
                dataSetNumber = +i - 1;
                break;
            }
        }
        
        let results = iteratorFunc(X1, X2, dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, dataSet[dataSetNumber].e);
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
            labels: getArrayRange(X1, X2, 0.01),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: function(x) { return +f(dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, x).toFixed(2) },
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
                    x: +(results.start.y).toFixed(2),
                    y: +(results.start.x).toFixed(2)
                },
                {
                    x: +(results.end.y).toFixed(2),
                    y: +(results.end.x).toFixed(2)
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "green",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 2
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
            alertField.textContent = 'Немає коренів';
            return false;
        }
        alertField.className = 'success';
        let root = (results.green.x + results.center.x) / 2;
        alertField.textContent = `Корінь: ${roundInt(root)}`;

        const ctx = document.getElementById('duhot').getContext('2d');

        let data = {
            labels: getArrayRange(X1, X2, 0.01),
            datasets: [{
                label: "f(x) ", // Name it as you want
                function: x => {return +f(dataSet[dataSetNumber].h, dataSet[dataSetNumber].w, x).toFixed(2)},
                data: [], // Don't forget to add an empty data array, or else it will break
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                radius: 0,
                order: 1
            },{
                label: "Корінь", // Name it as you want
                function: () => {},
                data: [{
                    x: +(results.green.x).toFixed(2),
                    y: +(results.green.y).toFixed(2)
                },
                {
                    x: +(results.center.x).toFixed(2),
                    y: +(results.center.y).toFixed(2)
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "green",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 2,
                order: 0
            },{
                label: "Не корінь", // Name it as you want
                function: () => {},
                data: [{
                    x: +(results.red.x).toFixed(2),
                    y: +(results.red.y).toFixed(2)
                },
                {
                    x: +(results.center.x).toFixed(2),
                    y: +(results.center.y).toFixed(2)
                }], // Don't forget to add an empty data array, or else it will break
                borderColor: "red",
                borderWidth: 5,
                order: 0,
                fill: false,
                radius: 2,
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
        
        
    });
};
