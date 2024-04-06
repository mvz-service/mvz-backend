var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const puppeteer = require('puppeteer'); // 웹 크롤링을 위한 puppeteer 라이브러리

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // cors 설정

app.get('/poster/:moviecode', async (req,res)=>{

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
    
            if(req.resourceType() !== "a") { // 이미지를 제외한 모든것을 거부
                req.abort();
            }else{
                req.continue();
            }

        });
    
        await page.waitForSelector('.ui-widget.ui-widget-content',{visible : true}); // 팝업창이 생길때까지 기다렸다가 가져오기
    
        const respone = await page.evaluate(()=>{ // 자바스크립트를 실행할수있게 해주는 함수
            return document.querySelector('.ui-dialog .basic .info1 .thumb').getAttribute('href'); // 이미지의 주소를 가져옵니다.
        });
    
        await browser.close();
        
        if(respone === "#"){
            console.log('데이터가 존재하지 않습니다.');
            res.json({src : ""});
        }else{
            console.log('데이터를 가져왔습니다.');
            res.json({src : `https://kobis.or.kr/${respone}`});
        }

    }
    catch(error) {
        await browser.close();
        console.error('Error',error);
        res.json({src : ""});
    }
    
});

module.exports = app;
