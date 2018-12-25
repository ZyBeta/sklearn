const fs = require('fs');
const path = require('path');
const axios = require('axios');

const filePath = 'D:/worktemp/getData/data';
const fileName = 'temp.csv';

const keysBK = [
    'Type',
    'Region',
    'MunicipalityCode',
    'Prefecture',
    'Municipality',
    'DistrictName',
    'NearestStation',
    'TimeToNearestStation',
    'TradePrice',
    'PricePerUnit',
    'FloorPlan',
    'Area',
    'UnitPrice',
    'LandShape',
    'Frontage',
    'TotalFloorArea',
    'BuildingYear',
    'Structure',
    'Use',
    'Purpose',
    'Direction',
    'Classification',
    'Breadth',
    'CityPlanning',
    'CoverageRatio',
    'FloorAreaRatio',
    'Period',
    'Renovation',
    'Remarks'
];

const keys = [
    'Type',
    'Region',
    'MunicipalityCode',
    'Prefecture',
    'Municipality',
    'DistrictName',
    'NearestStation',
    'TimeToNearestStation',
    'TradePrice',
    'PricePerUnit',
    'FloorPlan',
    'Area',
    'UnitPrice',
    'LandShape',
    'Frontage',
    'TotalFloorArea',
    'BuildingYear',
    'Structure',
    'Use',
    'Purpose',
    'Direction',
    'Classification',
    'Breadth',
    'CityPlanning',
    'CoverageRatio',
    'FloorAreaRatio',
    'Period',
    'Renovation',
    'Remarks'
];

const getLand = area => {
    return axios.get('/TradeListSearch', {
        baseURL: 'http://www.land.mlit.go.jp/webland/api/',
        params: {
            from: 20181,
            to: 20184,
            area
        },
        proxy: {
            host: '192.168.11.145',
            port: 3128
        }
    })
};

const getLandBatch = async () => {
    const file = path.join(filePath, fileName);
    const header = keys.join(',');
    try {
        fs.unlinkSync(file);
    } catch (e) {
        console.warn(e);
    }
    fs.writeFileSync(file, header + '\r\n', {flag: 'a+'});
    for (let i = 1; i <= 47; i++) {
        const area = i < 10 ? `0${i}` : i.toString();
        const result = await getLand(area);
        result.data.data.forEach(data => {
            const bodyArr = [];
            keys.forEach(key => {
                if (data[key]) {
                    if (key === 'BuildingYear') {
                        const year = data[key];
                        const regexp = /([0-9]*)年/;
                        if (year.indexOf('平成') !== -1) {
                            const yearNum = year.match(regexp)[1];
                            bodyArr.push(`${30 - yearNum}`);
                        } else if (year.indexOf('昭和') !== -1) {
                            const yearNum = year.match(regexp)[1];
                            bodyArr.push(`${93 - yearNum}`);
                        } else {
                            bodyArr.push('');
                        }
                    } else if (key === 'TotalFloorArea' || key === 'Area' || key === 'Frontage' ) {
                        const area = data[key];
                        const regexp = /([0-9]*)/;
                        if (area.match(regexp).length > 1) {
                            bodyArr.push(area.match(regexp)[0]);
                        } else {
                            bodyArr.push('');
                        }
                    }
                    else {
                        if (data[key].indexOf(',') !== -1) {
                            bodyArr.push(data[key].replace(','));
                        } else {
                            bodyArr.push(data[key]);
                        }
                    }
                } else {
                    bodyArr.push('');
                }
            });
            const body = bodyArr.join(',');
            fs.writeFileSync(file, body + '\r\n', {flag: 'a+'});
        });
        console.log(`area ${area} is complete. got ${result.data.data.length}`)
    }
};

getLandBatch();
