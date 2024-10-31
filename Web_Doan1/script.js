const control_monitor = document.querySelector('.control-monitor');
const search = document.querySelector('.search-box button');
const control_led = document.querySelector('.control-led');
const control_fan = document.querySelector('.control-fan');
const deviceHide = document.querySelector('.device-hide');
const error404 = document.querySelector('.not-found');
const clock = document.querySelector('.clock');
const ledcr7 = document.querySelector('.led-cr7-select');
const fanmu = document.querySelector('.fan-mu-select');

search.addEventListener ('click', () => {

    const device = document.querySelector('.search-box input').value;  
    if (device == '')
         return;

    if (device == 'BƠM' || device == 'bơm') {
        deviceHide.textContent = device;
        control_monitor.style.height = '250px';
        control_monitor.classList.add('active')
        control_led.classList.add('active');
        ledcr7.classList.add('active');
        fanmu.classList.remove('active');

        control_fan.classList.remove('active');
        error404.classList.remove('active');
        clock.classList.add('active');

        // setTimeout (() => {
        //     control_monitor.classList.remove ('active');  
        // }, 2500 );
    } 
    else if (device == 'ĐÈN' || device == 'đèn'){
        deviceHide.textContent = device;
        control_monitor.style.height = '250px';
        control_monitor.classList.add('active')
        control_fan.classList.add('active');
        control_led.classList.remove('active');
        error404.classList.remove('active');
        clock.classList.add('active');
        ledcr7.classList.remove('active');
        fanmu.classList.add('active');

        // setTimeout (() => {
        //     control_monitor.classList.remove ('active');  
        // }, 2500 );
    }
    else if (device == "time" || device == "TIME"  ){
        deviceHide.textContent = device;
        control_monitor.style.height = '250px';
        control_monitor.classList.add('active')
        control_led.classList.remove('active');
        ledcr7.classList.remove('active');
        fanmu.classList.remove('active');

        control_fan.classList.remove('active');
        error404.classList.remove('active');
        clock.classList.remove('active');


        // setTimeout (() => {
        //     control_monitor.classList.remove ('active');  
        // }, 2500 );
    }
    else {
        control_monitor.style.height = '250px';
        control_monitor.classList.add('active')
        control_fan.classList.remove('active');
        control_led.classList.remove('active');
        clock.classList.add('active');
        ledcr7.classList.remove('active');
        fanmu.classList.remove('active');
        error404.classList.add('active');  
         
        // setTimeout (() => {
        //     error404.classList.add('active');  
        // }, 500);     
    }
   
    
    
});
    const date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    switch(month){
        case 1:
            month = "JANUARARY";
        break;
        case 2:
            month = "FEBRUARY";
        break;
        case 3:
            month = "MARCH";
        break;
        case 4:
            month = "APRIL";
        break;
        case 5:
            month = "MAY";
        break;
        case 6:
            month = "JUNE";
        break;
        case 7:
            month = "JULY";
        break;
        case 8:
            month = "AUGUST";
        break;
        case 9:
            month = "SEPTEMBER";
        break;
        case 10:
            month = "OCTOBER";
        break;
        case 11:
            month = "NOVEMBER";
        break;
        default:
            month = "DECEMBER";
        break;
    }
    var day = date.getDate();
    document.getElementById("time-day").innerHTML = day;
    document.getElementById("time-month").innerHTML = month;

    function hienThiThoiGian(){
        const t = new Date ();
        let h = t.getHours();
        let m = t.getMinutes();
        let s = t.getSeconds();

        m = dinhdang2so(m);
        s = dinhdang2so(s);

        document.getElementById("thoigian").innerHTML = h + ":" + m + ":" + s;

       setTimeout(hienThiThoiGian, 1000);

    }
    function dinhdang2so(x) {
        if(x<10)
            x = '0' + x;
        return x;
    }


    const firebaseConfig = {
        apiKey: "AIzaSyC2-UNpGG3Q5pdo2EISJV60OgkusW07QO4",
        authDomain: "ttiot-db24f.firebaseapp.com",
        databaseURL: "https://ttiot-db24f-default-rtdb.firebaseio.com",
        projectId: "ttiot-db24f",
        storageBucket: "ttiot-db24f.appspot.com",
        messagingSenderId: "254769368395",
        appId: "1:254769368395:web:e335f9356175b24514acce",
        // measurementId: "G-EL9R271SJZ"
    };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  
  //functions
  // make sure that the name in ' ' match with name of your database child
  var nhietDo = document.getElementById('nhietdo');
  var dbRef = firebase.database().ref('Sensor').child('Temperature');
  var doAm = document.getElementById('doam');
  var dbRef2 = firebase.database().ref('Sensor').child('Humidity');
  var doamDat = document.getElementById('doamdat');
  var dbRef3 = firebase.database().ref('Sensor').child('SoilMoisture');

    let labels = [];
    let nhietDoData = [];
    let doAmData = [];
    let doamDatData = [];


    

  dbRef.on('value', snapshot => {
    nhietDo.innerText = snapshot.val() + "°C";
    const nhietDoValue = snapshot.val();
    checkTemperature(nhietDoValue);
    nhietDoData.push(nhietDoValue);
    updateChart1(nhietDoValue, 'Nhiệt độ (°C)');
    
    });
  dbRef2.on('value', snapshot =>{ 
    doAm.innerText = snapshot.val() + "%";
    const doAmValue = snapshot.val();
    doAmData.push(doAmValue);
    updateChart2(doAmValue, 'Độ ẩm (%)');
    });

  dbRef3.on('value', snapshot =>{ 
    doamDat.innerText = snapshot.val() + "%";
    const doamDatValue = snapshot.val();
    checkSoilMoisture(doamDatValue);
    doamDatData.push(doamDatValue);
    updateChart3(doamDatValue, 'Độ ẩm đất (%)');
    });

   


  
  // Khởi tạo biểu đồ
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: [],
    datasets: 
    [
        {
            label: '',
            data: [],
            backgroundColor: 'rgba(220, 220, 220, 1)',
            borderColor: 'rgba(220, 220, 220, 1)',
            borderWidth: 1.5
        },
        {
            label: '',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1.5
        },
        {
            label: '',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1.5
        }

    ]
    },
    options: {
        scales: {
        y: {
        beginAtZero: true
        }
        },
        
    }
});



// var month_num = date.getMonth() + 1;
// // Hàm cập nhật biểu đồ
// function updateChart1(value, label) {
//     myChart.data.labels.push(date.getDate() + "/" + month_num);
//     // myChart.data.labels.push(date.toLocaleTimeString());
//     myChart.data.labels.push(date.getHours() + ":" + date.getMinutes());


//     myChart.data.datasets[0].label = label;
//     myChart.data.datasets[0].data.push(value);
    
//     myChart.update();
// }


// function updateChart2(value, label) {

//     myChart.data.labels.push(date.getDate() + "/" + month_num);

//     // myChart.data.labels.push(date.toLocaleTimeString()
//     // );
//     myChart.data.labels.push(date.getHours() + ":" + date.getMinutes());

    
//     myChart.data.datasets[1].label = label;
//     myChart.data.datasets[1].data.push(value);
    
//     myChart.update();
// }
function updateChart1( value, label) {
    const date = new Date();
    myChart.data.labels.push(`${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`) ;
    myChart.data.datasets[0].label = label;
    myChart.data.datasets[0].data.push(value);
    myChart.update();
}

function updateChart2( value, label) {
    const date = new Date();
    myChart.data.labels.push(`${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`) ;
    myChart.data.datasets[1].label = label;
    myChart.data.datasets[1].data.push(value);
    myChart.update();
}

function updateChart3( value, label) {
    const date = new Date();
    myChart.data.labels.push(`${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`) ;
    myChart.data.datasets[2].label = label;
    myChart.data.datasets[2].data.push(value);
    myChart.update();
}



// // Cập nhật biểu đồ mỗi 5 phút
// setInterval(() => {
//     // Cập nhật biểu đồ 1
//     if (nhietDoData.length > 0) {
//         updateChart1(nhietDoData[nhietDoData.length - 1], 'Nhiệt độ (°C)');
//     }

//     // Cập nhật biểu đồ 2
//     if (doAmData.length > 0) {
//         updateChart2(doAmData[doAmData.length - 1], 'Độ ẩm (%)');
//     }
// }, 3600*1000/2); // 5 phút = 300000 milliseconds

// Xóa dữ liệu cũ sau mỗi tuần
setInterval(() => {
    let labels = [];
    let nhietDoData = [];
    let doAmData = [];
    dbRef.on('value', snapshot => {
        nhietDo.innerText = snapshot.val() + "°C";
        const nhietDoValue = snapshot.val();
        nhietDoData.push(nhietDoValue);
        updateChart1(nhietDoValue, 'Nhiệt độ (°C)');
        
        });
      dbRef2.on('value', snapshot =>{ 
        doAm.innerText = snapshot.val() + "%";
        const doAmValue = snapshot.val();
        doAmData.push(doAmValue);
        updateChart2(doAmValue, 'Độ ẩm (%)');
    });
    dbRef3.on('value', snapshot =>{ 
        doamDat.innerText = snapshot.val() + "%";
        const doamDatValue = snapshot.val();
        doamDatData.push(doamDatValue);
        updateChart3(doamDatValue, 'Độ ẩm đất (%)');
    });
    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];
    myChart.data.datasets[1].data = [];
    myChart.data.datasets[2].data = [];
    myChart.update();
}, 604800*1000); // 1 tuần = 604800000 milliseconds





  $(document).ready(function(){
    var database = firebase.database();
	var Bom;
    var Den;

	database.ref('Device').on("value", function(snap){
		Bom = snap.val().Bom;
		if(Bom == true){    // check from the firebase
			//$(".Light1Status").text("The light is off");
			document.getElementById("unact1").style.display = "none";
			document.getElementById("act1").style.display = "block";
		} else {
			//$(".Light1Status").text("The light is on");
			document.getElementById("unact1").style.display = "block";
			document.getElementById("act1").style.display = "none";
		}
	});

    $(".toggle-btn1").click(function(){
		var firebaseRef = firebase.database().ref('Device').child("Bom");

		if(Bom == true){    // post to firebase
			firebaseRef.set(false);
			Bom = false;
		} else {
			firebaseRef.set(true);
			Bom = true;
		}
	})

    database.ref('Device').on("value", function(snap){
		Den = snap.val().Den;
		if(Den == true){    // check from the firebase
			//$(".Light1Status").text("The light is off");
			document.getElementById("unact2").style.display = "none";
			document.getElementById("act2").style.display = "block";
		} else {
			//$(".Light1Status").text("The light is on");
			document.getElementById("unact2").style.display = "block";
			document.getElementById("act2").style.display = "none";
		}
	});

    $(".toggle-btn2").click(function(){
		var firebaseRef = firebase.database().ref('Device').child("Den");

		if(Den == true){    // post to firebase
			firebaseRef.set(false);
			Den = false;
		} else {
			firebaseRef.set(true);
			Den = true;
		}
	})
});

function searchRedirect() {
    var keyword = document.getElementById('search-input').value.trim().toLowerCase();
    if (keyword === 'dự báo') {
        window.location.href = 'dubao.html'; // Chuyển hướng đến trang khác
    }
}

// Xử lý sự kiện khi người dùng nhấn Enter trong ô tìm kiếm
document.getElementById("search-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchRedirect();
    }
});


// Khai báo hàm checkTemperature với tham số là giá trị nhiệt độ temperature
function checkTemperature(temperature) {
    // Tạo phần tử div để hiển thị cảnh báo
    const warningDiv = document.createElement('div');
    warningDiv.innerText = 'Cháy rồi! Nhiệt độ đã vượt quá ngưỡng';
    warningDiv.classList.add('warning-message'); // Thêm class để áp dụng CSS
    
    // Thiết lập các thuộc tính CSS cho cảnh báo
    warningDiv.style.cssText = `
    position: absolute; 
    font-size: 25px;
    text-align: center;
    top: 460px; 
    right: 430px;
    

    width: 400px;
    height: 80px;

    background: linear-gradient(90deg, rgba(43, 176, 238,0.95),rgba(235, 42, 74,0.5));
    backdrop-filter: blur(30px);
    border-radius: 22px;
    color: #fff;
    
    align-items: center;
    `;
    
    // Kiểm tra nếu nhiệt độ vượt quá 50 độ C
    if (temperature > 50) 
        // Hiển thị cảnh báo
        document.body.appendChild(warningDiv);
        else {
            // Xóa cảnh báo nếu có
            const warningElement = document.querySelector('.warning-message');
            if (warningElement) {
                warningElement.remove();
            } 
        // Xóa nội dung "Thời tiết nắng nóng..."
}
}

function checkSoilMoisture(soilmoisture) {
    // Tạo phần tử div để hiển thị cảnh báo
    const warningDiv = document.createElement('div');
    warningDiv.innerText = 'Độ ẩm đất khá thấp! Hãy tưới cây đi nào!';
    warningDiv.classList.add('warning-message'); // Thêm class để áp dụng CSS
    
    // Thiết lập các thuộc tính CSS cho cảnh báo
    warningDiv.style.cssText = `
    position: absolute; 
    font-size: 25px;
    text-align: center;
    top: 560px; 
    right: 430px;
    

    width: 400px;
    height: 80px;

    background: linear-gradient(90deg, rgba(43, 176, 238,0.95),rgba(235, 42, 74,0.5));
    backdrop-filter: blur(30px);
    border-radius: 22px;
    color: #fff;
    
    align-items: center;
    `;
    
    // Kiểm tra nếu nhiệt độ vượt quá 50 độ C
    if (soilmoisture < 50) 
        // Hiển thị cảnh báo
        document.body.appendChild(warningDiv);
        else {
            // Xóa cảnh báo nếu có
            const warningElement = document.querySelector('.warning-message');
            if (warningElement) {
                warningElement.remove();
            } 
        // Xóa nội dung "Thời tiết nắng nóng..."
}
}












