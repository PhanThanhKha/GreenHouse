#include <DHT.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#define BLYNK_TEMPLATE_ID "TMPL6_66ZDroG"
#define BLYNK_TEMPLATE_NAME "DHT11"
#define BLYNK_AUTH_TOKEN "6gr3xIantcGpAXqOXUidSzuaGW9YmUmA"
#define BLYNK_PRINT Serial
#include <BlynkRpcClient.h>
#include <BlynkSimpleEsp32.h>

#define DHTPIN 4
#define DHTTYPE DHT11   
#define SOILMOISTUREPIN 34 // Chân cho cảm biến độ ẩm đất

#define RELAY_BOM 5
#define RELAY_DEN 19

#define BTN_BOM 22
#define BTN_DEN 23

#define BTN_BOM_vpin    V3
#define BTN_DEN_vpin    V4

int RELAY_BOM_state = 0;
int RELAY_DEN_state = 0;

DHT dht(DHTPIN, DHTTYPE);
BlynkTimer timer; 

char auth [] = BLYNK_AUTH_TOKEN;
const char* ssid     = "Kha";                 
const char* password = "0123456789";  

bool id = false;

const char* FIREBASE_HOST ="ttiot-db24f-default-rtdb.firebaseio.com";
const char* FIREBASE_AUTH="SlZufiwlp9TJsbB0eN1H7GCsolr1";
const char* databaseURL1="https://ttiot-db24f-default-rtdb.firebaseio.com/Sensor.json";
const char* databaseURL2="https://ttiot-db24f-default-rtdb.firebaseio.com/Device/Bom.json";
const char* databaseURL3="https://ttiot-db24f-default-rtdb.firebaseio.com/Device/Den.json";

int cnt_con = 0;

BLYNK_CONNECTED() {
  Blynk.syncVirtual(BTN_BOM_vpin);
  Blynk.syncVirtual(BTN_DEN_vpin);
}

BLYNK_WRITE(BTN_BOM_vpin) {
  RELAY_BOM_state = param.asInt();
  digitalWrite(RELAY_BOM, RELAY_BOM_state);
}

BLYNK_WRITE(BTN_DEN_vpin) {
  RELAY_DEN_state = param.asInt();
  digitalWrite(RELAY_DEN, RELAY_DEN_state);
}

void Connect() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
    cnt_con++;
    if(cnt_con > 59) {
      cnt_con = 0;
      Serial.println("Failed to connect !");
      // Handle reconnection process
    }
  }

  Serial.println("");
  Serial.print("Successfully connected to : ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(19200);
  Connect();

  dht.begin();
  timer.setInterval(1000L, sendSensor);

  pinMode(BTN_BOM, INPUT_PULLUP);
  pinMode(BTN_DEN, INPUT_PULLUP);

  pinMode(RELAY_BOM,OUTPUT);
  pinMode(RELAY_DEN,OUTPUT);
  
  digitalWrite(RELAY_BOM,LOW);
  digitalWrite(RELAY_DEN,LOW);

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);
}

void loop() {
  Blynk.run();
  timer.run();
  listen_push_buttons();
}

void listen_push_buttons(){
    //--------------------------------------------------------------------------
    if(digitalRead(BTN_BOM) == LOW){
      delay(200);
      control_relay(1);
      Blynk.virtualWrite(BTN_BOM_vpin, RELAY_BOM_state); //update button state
    }
    //--------------------------------------------------------------------------
    else if (digitalRead(BTN_DEN) == LOW){
      delay(200);
      control_relay(2);
      Blynk.virtualWrite(BTN_DEN_vpin, RELAY_DEN_state); //update button state
    }
}

void control_relay(int relay) {
    if (relay == 1) {
        RELAY_BOM_state = !RELAY_BOM_state;
        digitalWrite(RELAY_BOM, RELAY_BOM_state);
        Blynk.virtualWrite(BTN_BOM_vpin, RELAY_BOM_state);
    } else if (relay == 2) {
        RELAY_DEN_state = !RELAY_DEN_state;
        digitalWrite(RELAY_DEN, RELAY_DEN_state);
        Blynk.virtualWrite(BTN_DEN_vpin, RELAY_DEN_state);
    }
}

void sendSensor() {
  float h = dht.readHumidity();
  float t = dht.readTemperature(); 
  int soilMoisture = analogRead(SOILMOISTUREPIN);
  soilMoisture = map(soilMoisture, 0, 4095, 100, 0); // Chuyển đổi giá trị độ ẩm đất

  // Chuỗi dữ liệu để gửi lên Firebase
  String data1= String("{\"Humidity\":") + String(h) + String(",\"Temperature\":") + String(t) + String(",\"SoilMoisture\":") + String(soilMoisture) + String("}");

  HTTPClient http;
  http.begin(databaseURL1);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", FIREBASE_AUTH);
  int httpResponseCode1 = http.PUT(data1);

  if(httpResponseCode1 > 0){
    Serial.println("Data sent to Firebase");
  }
  else{
    Serial.print("Error sending data to Firebase, response code: ");
    Serial.println(httpResponseCode1);
  }
  http.end();

  // Sử dụng BlynkTimer để thực hiện các yêu cầu HTTP không đồng bộ
  timer.setTimeout(200L, sendRequest2);
}

void sendRequest2() {
  HTTPClient http;
  http.begin(databaseURL2);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", FIREBASE_AUTH);
  int httpResponseCode2 = http.GET();

  if (httpResponseCode2 > 0) {
    String payload = http.getString();
    // Check if "Led1Status":"1" exists in the payload
    int soilMoisture = map(analogRead(SOILMOISTUREPIN), 0, 4095, 100, 0); // Chuyển đổi giá trị độ ẩm đất
    if ((soilMoisture > 50) && (payload == "false")) {
      digitalWrite(RELAY_BOM, LOW); // Bật relay
      Blynk.virtualWrite(V3, digitalRead(RELAY_BOM));
      Serial.println("Tat relay");
    } else {
      digitalWrite(RELAY_BOM, HIGH); // Tắt relay
      Blynk.virtualWrite(V3, digitalRead(RELAY_BOM));
      Serial.println("Mo relay");
    } 
  }
  http.end();

  // Sử dụng BlynkTimer để thực hiện các yêu cầu HTTP không đồng bộ
  timer.setTimeout(200L, sendRequest3);
}

void sendRequest3() {
  HTTPClient http;
  http.begin(databaseURL3);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", FIREBASE_AUTH);
  int httpResponseCode3 = http.GET();

  if (httpResponseCode3 > 0) {
    String payload1 = http.getString();
    // Check if "Led1Status":"1" exists in the payload
    if (payload1 == "false") {
      digitalWrite(RELAY_DEN, LOW); // Bật relay
      Blynk.virtualWrite(V4, digitalRead(RELAY_DEN));
      Serial.println("Tat den");
    } else {
      digitalWrite(RELAY_DEN, HIGH); // Tắt relay
      Blynk.virtualWrite(V4, digitalRead(RELAY_DEN));
      Serial.println("Bat den");
    } 
  }
  http.end();

  // Gửi dữ liệu lên Blynk
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int soilMoisture = map(analogRead(SOILMOISTUREPIN), 0, 4095, 100, 0);
  Blynk.virtualWrite(V0, t);
  Blynk.virtualWrite(V1, h);
  Blynk.virtualWrite(V2, soilMoisture); // Giả sử chân ảo V2 dùng cho độ ẩm đất
}
 
