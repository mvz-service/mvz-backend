var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const puppeteer = require('puppeteer'); // 웹 크롤링을 위한 puppeteer 라이브러리
const sharp = require('sharp');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // cors 설정

// 영화 슬라이드형식 포스터
app.get('/slide/poster/:moviecode', async (req,res)=>{

    const {moviecode} = req.params;

    if(!moviecode) res.json({src : ''});;

    const browser = await puppeteer.launch(); //  {headless : true} 웹브라우저 실행 headless 는 화면을 띄울지
    const page = await browser.newPage(); // 페이지 시작

    // console.log(page);

    // page.setDefaultNavigationTimeout(30000); // 타임아웃을 30000 -> 60000 으로 수정

    try {

        await page.goto(`https://kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do?dtTp=movie&dtCd=${moviecode}`,{timeout : 0}); // 페이지 링크로 이동

        await page.setRequestInterception(true); // 이것을 사용해야 page.on() 을 사용할수 있음
    
        page.on('request',(req)=>{
    
            if(req.resourceType() !== "a" || req.resourceType() !== "image") { // 이미지를 제외한 모든것을 거부
                req.abort();
            }else{
                req.continue();
            }

        });
    
        await page.waitForSelector('.ui-widget.ui-widget-content',{visible : true}); // 팝업창이 생길때까지 기다렸다가 가져오기
    
        const imageURL = await page.evaluate(()=>{ // 자바스크립트를 실행할수있게 해주는 함수
            return document.querySelector('.ui-dialog .basic .info1 .thumb').getAttribute('href'); // 이미지의 주소를 가져옵니다.
        });

        const newPage = await browser.newPage();
        const viewSource = await newPage.goto(`https://kobis.or.kr${imageURL}`,{timeout:0});
        const buffer = await viewSource.buffer();

        const resizedImageBuffer = await sharp(buffer)
            .resize(1455,560)
            .toBuffer();

        if(!resizedImageBuffer){
            console.log('데이터가 존재하지 않습니다.');
            res.json("");
        }else{
            console.log('데이터를 가져왔습니다.');
            res.type('blob').send(resizedImageBuffer);
        }

    }
    catch(error) {
        await browser.close();
        console.error('에러가 발생했습니다 : ',error);
        res.json("");
    }
    
});

// 영화 리스트형식 포스터
app.get('/movie/poster/:moviecode', async (req,res)=>{

    const {moviecode} = req.params;

    if(!moviecode) res.json({src : ''});;

    const browser = await puppeteer.launch(); //  {headless : true} 웹브라우저 실행 headless 는 화면을 띄울지
    const page = await browser.newPage(); // 페이지 시작

    // console.log(page);

    // page.setDefaultNavigationTimeout(30000); // 타임아웃을 30000 -> 60000 으로 수정

    try {

        await page.goto(`https://kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do?dtTp=movie&dtCd=${moviecode}`,{timeout : 0}); // 페이지 링크로 이동

        await page.setRequestInterception(true); // 이것을 사용해야 page.on() 을 사용할수 있음
    
        page.on('request',(req)=>{
    
            if(req.resourceType() !== "a" || req.resourceType() !== "image") { // 이미지를 제외한 모든것을 거부
                req.abort();
            }else{
                req.continue();
            }

        });
    
        await page.waitForSelector('.ui-widget.ui-widget-content',{visible : true}); // 팝업창이 생길때까지 기다렸다가 가져오기
    
        const imageURL = await page.evaluate(()=>{ // 자바스크립트를 실행할수있게 해주는 함수
            return document.querySelector('.ui-dialog .basic .info1 .thumb').getAttribute('href'); // 이미지의 주소를 가져옵니다.
        });

        const newPage = await browser.newPage();
        const viewSource = await newPage.goto(`https://kobis.or.kr${imageURL}`,{timeout:0});
        const buffer = await viewSource.buffer();

        const resizedImageBuffer = await sharp(buffer)
            .resize(278,407)
            .toBuffer();

        if(!resizedImageBuffer){
            console.log('데이터가 존재하지 않습니다.');
            res.json({error : "데이터가 존재하지 않습니다."});
        }else{
            console.log('데이터를 가져왔습니다.');
            res.type('blob').send(resizedImageBuffer);
        }

    }
    catch(error) {
        await browser.close();
        console.error('에러가 발생했습니다 : ',error);
        res.json({error : "에러가 발생했습니다."});
    }
    
});

// 영화 뷰 포스터
app.get('/view/poster/:moviecode', async (req,res)=>{

    const {moviecode} = req.params;

    if(!moviecode) res.json({src : ''});;

    const browser = await puppeteer.launch(); //  {headless : true} 웹브라우저 실행 headless 는 화면을 띄울지
    const page = await browser.newPage(); // 페이지 시작

    // console.log(page);

    // page.setDefaultNavigationTimeout(30000); // 타임아웃을 30000 -> 60000 으로 수정

    try {

        await page.goto(`https://kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do?dtTp=movie&dtCd=${moviecode}`,{timeout : 0}); // 페이지 링크로 이동

        await page.setRequestInterception(true); // 이것을 사용해야 page.on() 을 사용할수 있음
    
        page.on('request',(req)=>{
    
            if(req.resourceType() !== "a" || req.resourceType() !== "image") { // 이미지를 제외한 모든것을 거부
                req.abort();
            }else{
                req.continue();
            }

        });
    
        await page.waitForSelector('.ui-widget.ui-widget-content',{visible : true}); // 팝업창이 생길때까지 기다렸다가 가져오기
    
        const imageURL = await page.evaluate(()=>{ // 자바스크립트를 실행할수있게 해주는 함수
            return document.querySelector('.ui-dialog .basic .info1 .thumb').getAttribute('href'); // 이미지의 주소를 가져옵니다.
        });

        const newPage = await browser.newPage();
        const viewSource = await newPage.goto(`https://kobis.or.kr${imageURL}`,{timeout:0});
        const buffer = await viewSource.buffer();

        const resizedImageBuffer = await sharp(buffer)
            .resize(1903,550)
            .toBuffer();

        if(!resizedImageBuffer){
            console.log('데이터가 존재하지 않습니다.');
            res.json({error : "데이터가 존재하지 않습니다."});
        }else{
            console.log('데이터를 가져왔습니다.');
            res.type('blob').send(resizedImageBuffer);
        }

    }
    catch(error) {
        await browser.close();
        console.error('에러가 발생했습니다 : ',error);
        res.json({error : "에러가 발생했습니다."});
    }
    
});

module.exports = app;
