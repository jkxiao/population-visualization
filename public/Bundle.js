import Country from "./Country.js"

export default class Bundle {

    constructor(barChartCanvas, lineChartCanvas) {
        this.countries = [];
        this.index = 0;
        Bundle.years = [
            1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018
        ];
        Bundle.backgroundColor = [
            'rgba( 81, 213, 126, 0.5)',
            'rgba(166, 203,  88, 0.5)',
            'rgba(220, 220,  99, 0.5)',
            'rgba(240, 213, 102, 0.5)',
            'rgba(243, 198, 103, 0.5)',
            'rgba(248, 159, 101, 0.5)',
            'rgba(251, 129, 119, 0.5)',
            'rgba(255,  79, 105, 0.5)'
        ];
        Bundle.borderColor = [
            'rgba( 81, 213, 126, 1.0)',
            'rgba(166, 203,  88, 1.0)',
            'rgba(220, 220,  99, 1.0)',
            'rgba(240, 213, 102, 1.0)',
            'rgba(243, 198, 103, 1.0)',
            'rgba(248, 159, 101, 1.0)',
            'rgba(251, 129, 119, 1.0)',
            'rgba(255,  79, 105, 1.0)'
        ];
        Bundle.period = Bundle.backgroundColor.length;
        Chart.defaults.global.defaultFontFamily = "Courier";
        Chart.defaults.global.defaultFontSize = 24;
        this.year = "2018";
        this.barChart = new Chart(barChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [this.year],
                datasets: []
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: "#C5C6C7",
                            lineWidth: 2.5,
                            drawTicks: false,
                            zeroLineColor: "#C5C6C7",
                            zeroLineWidth: 2.5
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#C5C6C7",
                            padding: 10,
                            fontSize: 40
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: "#C5C6C7",
                            lineWidth: 0.5,
                            zeroLineColor: "#C5C6C7",
                            zeroLineWidth: 2.5
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#C5C6C7",
                            padding: 10
                        }
                    }]
                }
            }
        });
        this.lineChart = new Chart(lineChartCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: Bundle.years,
                datasets: []
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: "#1F2833",
                            lineWidth: 0.5,
                            drawBorder: true,
                            drawTicks: false
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#1F2833",
                            padding: 10,
                            maxTicksLimit: 6
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: "#1F2833",
                            lineWidth: 0.5,
                            drawBorder: true,
                            drawTicks: false
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#1F2833",
                            padding: 10,
                        }
                    }]
                },
                legend: {
                    labels: {
                        fontColor: "#1F2833"
                    }
                }
            }
        });
    }

    async append(code) {
        if (this.index >= 8) {
            alert("Maximum Number 8");
            return;
        }
        let country = await Country.findCountry(code);
        this.countries.push(country);

        this.barChart.data.datasets.push({
            label: [country.name],
            data: [country.population[this.year]],
            backgroundColor: Bundle.backgroundColor[this.index],
            borderColor: Bundle.borderColor[this.index],
            borderWidth: 5
        });
        this.barChart.update();

        this.lineChart.data.datasets.push({
            label: country.name,
            data: Object.values(country.population),
            pointBackgroundColor: Bundle.borderColor[this.index],
            pointRadius: 7.5,
            pointBorderColor: "#1F2833",
            pointBorderWidth: 1,
            pointHoverRadius: 15,
            borderColor: Bundle.borderColor[this.index],
            borderWidth: 5,
            fill: false
        });
        this.lineChart.update();

        this.index ++;
    }

    updateYear(year) {
        this.year = year;
        this.barChart.data.labels = [this.year];
        for (let i = 0; i < this.countries.length; i ++) {
            this.barChart.data.datasets[i].data = [this.countries[i].population[this.year]];
        }
        this.barChart.update();
    }

    clearCharts() {
        this.countries = [];
        this.index = 0;

        this.barChart.data.datasets = [];
        this.barChart.update();

        this.lineChart.data.datasets = [];
        this.lineChart.update();
    }
}