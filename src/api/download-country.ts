import express from 'express'

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router()
const osmtogeojson = require('osmtogeojson');

router.get('/', async (req, res) => {
  await downloadGeoJson();
  res.send('GeoJSON files downloaded.');
})

const wikidataPath = 'http://localhost:8082/nj-map-data/全球国家的wikidata.json'

// Overpass API 查询模板
const overpassApiUrl = 'https://overpass-api.de/api/interpreter';
const overpassQueryTemplate = (wikidataId) => `
[out:json];
(
  relation["wikidata"="${wikidataId}"];
);
out body;
>;
out skel qt;
`;

// 带省份的查询模板
// [out:json];
// area["wikidata"="Q30"];  // 替换为目标国家的 Wikidata ID，这里 "Q30" 代表美国
// (
//   relation["boundary"="administrative"]["admin_level"="4"](area);  // 一级行政区（如省、州）
// );
// out body;
// >;
// out skel qt;

// 创建目录用于存放下载的 GeoJSON 文件
const geojsonDir = path.join(__dirname, 'geojson');
if (!fs.existsSync(geojsonDir)) {
    fs.mkdirSync(geojsonDir);
}

// 下载函数：遍历国家列表，发送请求，保存为 GeoJSON 文件
async function downloadGeoJson() {
  let countryWikidataList = [];
  await axios.get(wikidataPath).then((res: any) => {
    res.data.forEach((item: any) => {
      countryWikidataList.push({
        wikidataId: item.country.split('/').pop(),
        countryLabel: item.countryLabel
      })
    })
  })

  for (const item of countryWikidataList) {
      const query = overpassQueryTemplate(item.wikidataId);

      try {
          const response = await axios.post(overpassApiUrl, query, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          });

          // const geoJsonData = response.data;
          const osmData = response.data;

          // 使用 osmtogeojson 转换为 GeoJSON 格式
          const geoJsonData = osmtogeojson(osmData);

          // 保存为 GeoJSON 文件
          const filePath = path.join(geojsonDir, `${item.countryLabel+item.wikidataId}.geojson`);
          fs.writeFileSync(filePath, JSON.stringify(geoJsonData, null, 2));

          console.log(`GeoJSON for ${item.countryLabel} saved to ${filePath}`);
      } catch (error) {
          console.error(`Error downloading GeoJSON for ${item.countryLabel}:`);
      }
  }
}

export default router
