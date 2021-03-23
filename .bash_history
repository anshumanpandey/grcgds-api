      </objRequest>
    </MultiplePrices>
  </soap:Body>
</soap:Envelope>'
#1612170801
clear
#1612170802
curl --location --request POST 'https://62.28.221.122/Rentway_WS/getMultiplePrices.asmx' --header 'Content-Type: text/xml; charset=utf-8' --header 'SOAPAction: http://www.jimpisoft.pt/Rentway_Reservations_WS/getMultiplePrices/MultiplePrices' --data '<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <MultiplePrices xmlns="http://www.jimpisoft.pt/Rentway_Reservations_WS/getMultiplePrices">
      <objRequest>
        <companyCode>9999</companyCode>
        <customerCode>10005</customerCode>
        <pickUp>
          <Date>2021-02-01 10:00</Date>
          <rentalStation>24</rentalStation>
        </pickUp>
        <dropOff>
          <Date>2021-02-25 20:00</Date>
          <rentalStation>24</rentalStation>
        </dropOff>
        <Date_of_Birth>1990-01-30</Date_of_Birth>
        <username>ws_test</username>
        <password>123456</password>
      </objRequest>
    </MultiplePrices>
  </soap:Body>
</soap:Envelope>'
#1612170831
clear
#1612170834
curl --location --request POST 'https://62.28.221.122/Rentway_WS/getStations.asmx' --header 'Content-Type: text/xml;charset=UTF-8' --header 'SOAPAction: http://www.jimpisoft.pt/Rentway_Reservations_WS/getStations/getStations' --data '<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getStations xmlns="http://www.jimpisoft.pt/Rentway_Reservations_WS/getStations">
      <objRequest>
        <companyCode>9948</companyCode>
        <customerCode>23247</customerCode>
        <onlyVLSEnabled>false</onlyVLSEnabled>
      </objRequest>
    </getStations>
  </soap:Body>
</soap:Envelope>'
#1612182680
ls
#1612182682
cd www/
#1612182683
ls
#1612182726
cd mobilieapp
#1612182731
cd mobileapp
#1612182864
ls
#1612182881
cd cd ..
#1612182946
cd ..
#1612182957
nano .htaccess 
#1612182998
clear
#1612183000
ls
#1612183025
cd admin
#1612183026
ls
#1612183080
cd ..
#1612183082
cd ..
#1612183102
ls
#1612183111
cd preview/
#1612183134
ls
#1612183142
cd classes/
#1612183143
;s
#1612183144
ls
#1612183185
ls
#1612183194
cd LocationParsers/
#1612183196
ls
#1612183207
nano JimpisoftLocationParser.js 
#1612183261
node JimpisoftLocationParser.js 
#1612183293
git checkout JimpisoftLocationParser.js 
#1612183295
cd ..
#1612183296
cd ..
#1612183298
cd ..
#1612183301
cd www/
#1612183359
nano test.js
#1612183384
ls
#1612183415
cd ..
#1612183420
cd preview/
#1612183425
nano test.js
#1612183441
nano test.js 
#1612183445
node test.js 
#1612183593
nano test.js 
#1612183608
vim test.js 
#1612183633
nano test.js 
#1612183642
node test.js 
#1612183719
vim test.js 
#1612183732
nano test.js 
#1612183742
node test.js 
#1612183774
vim test.js 
#1612183782
nano test.js 
#1612183789
node test.js 
#1612183974
vim test.js 
#1612183986
nano test.js 
#1612183994
node test.js 
#1612184065
vim test.js 
#1612184102
node test.js 
#1612184115
vim test.js 
#1612184133
node test.js 
#1612188894
cd ..
#1612188896
cd www/
#1612188897
ls
#1612188907
cd ota_api_test/
#1612188913
git pull origin master
#1612188926
git status
#1612188946
git merge --abort
#1612188948
git status
#1612188955
git pull origin test.php 
#1612188958
git pull origin test
#1612188963
pm2 restart 8
#1612189205
git pull origin test
#1612189208
pm2 restart 8
#1612189382
cd ..
#1612189386
cd ota_api
#1612189391
git pull origin master
#1612189397
pm2 status
#1612189406
pm2 restart 7
#1612189409
pm2 logs 7
#1612189573
cd ..
#1612189575
cd ..
#1612189578
cd preview/
#1612189582
nano test.js 
#1612189632
node test.js 
#1612189660
vim test.js 
#1612189679
nano test.js 
#1612189734
vim test.js 
#1612189740
nano test.js 
#1612189810
node test.js 
#1612189874
nano test.js 
#1612189923
node test.js 
#1612191961
pm2 logs 7
#1612192868
cd ..
#1612192873
cd www/ota_api
#1612192874
git pull
#1612192886
pm2 restart 7
#1612192889
cd .
#1612192891
cd ..
#1612192898
cd ota_api_test/
#1612192905
git pull origin test
#1612192910
pm2 restart 8
#1612192917
pm2 logs 7
#1612681654
pm2 logs 8
#1612682806
cd www/ota_api_test/
#1612682813
git pull origin test
#1612682839
pm2 restart 8
#1612710993
pm2 logs 8
#1612954406
cd www/ota_api_test/
#1612954411
git pull origin test
#1612954416
pm2 restart 8
#1613490900
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "SearchUID": "9b629d2d-4577-4dc5-9c17-1c1d4c5fdf1f",
    "CarUID": "JY63",
    "Title": "Mr.",
    "Name": "Rick",
    "Surname": "Little",
    "PhoneCountryCode": "+1",
    "Phone": "8006471058",
    "Email": "test25@test.com",
    "BirthDate": "1985-11-20T08:50:32.263Z",
    "ResidenceCountryCode": "GB",
    "FlightNumber": "123",
    "CustomerComment": "",
    "ReferenceNumber": "abcdef1",
    "CoverageOfferID": 10,
    "PaypalTransactionNo": "2KW45571AS244050M"
}'
#1613490948
clear
#1613490950
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "SearchUID": "9b629d2d-4577-4dc5-9c17-1c1d4c5fdf1f",
    "CarUID": "JY63",
    "Title": "Mr.",
    "Name": "Rick",
    "Surname": "Little",
    "PhoneCountryCode": "+1",
    "Phone": "8006471058",
    "Email": "test25@test.com",
    "BirthDate": "1985-11-20T08:50:32.263Z",
    "ResidenceCountryCode": "GB",
    "FlightNumber": "123",
    "CustomerComment": "",
    "ReferenceNumber": "abcdef10",
    "CoverageOfferID": 10,
    "PaypalTransactionNo": "2KW45571AS244050M"
}'
#1613491213
clear
#1613491215
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data-raw '{
   "SearchUID":"9b629d2d-4577-4dc5-9c17-1c1d4c5fdf1f",
   "CarUID":"JY63",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"1",
   "CoverageOfferID":10
}'
#1613491226
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"9b629d2d-4577-4dc5-9c17-1c1d4c5fdf1f",
   "CarUID":"JY63",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"1",
   "CoverageOfferID":10
}'
#1613491243
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"9b629d2d-4577-4dc5-9c17-1c1d4c5fdf1f",
   "CarUID":"JY63",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"2",
   "CoverageOfferID":10
}'
#1613491255
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"9b629d2d-4577-4dc5-9c17-1c1d4c5fdf1f",
   "CarUID":"JY63",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"10",
   "CoverageOfferID":10
}'
#1613491634
curl -v
#1613491641
curl --help
#1613491647
curl -V
#1613498349
clear
#1613498443
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"242fb953-4f60-4d22-ac60-6e53f0d9ff83",
   "CarUID":"C7HV",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"10",
   "CoverageOfferID":10
}'
#1613498459
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"242fb953-4f60-4d22-ac60-6e53f0d9ff83",
   "CarUID":"C7HV",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"11",
   "CoverageOfferID":10
}'
#1613498474
clear
#1613498476
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"242fb953-4f60-4d22-ac60-6e53f0d9ff83",
   "CarUID":"C7HV",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"12",
   "CoverageOfferID":10
}'
#1613498492
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"242fb953-4f60-4d22-ac60-6e53f0d9ff83",
   "CarUID":"C7HV",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"100",
   "CoverageOfferID":10
}'
#1613499655
clear
#1613499658
curl --location --request POST 'https://booking.discovercarhire.com/api/Payment/BindTransaction?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "PaymentGateway": 2,
    "TransactionID": "1B713121K64613334",
    "Amount": 46.94,
    "CurrencyCode": "GBP",
    "ReservationNumber": "DC-1720470"
}'
#1613499867
clear
#1613499869
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"242fb953-4f60-4d22-ac60-6e53f0d9ff83",
   "CarUID":"C7HV",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"101",
   "CoverageOfferID":10
}'
#1613500506
clear
#1613500508
curl --location --request POST 'https://booking.discovercarhire.com/api/Payment/BindTransaction?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "PaymentGateway": 2,
    "TransactionID": "67768412FN831554W",
    "Amount": 46.94,
    "CurrencyCode": "GBP",
    "ReservationNumber": "DC-1720492"
}'
#1613500613
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"332e85ff-182b-4d0a-acea-c01e92802d05",
   "CarUID":"YTGJ",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"102",
   "CoverageOfferID":10
}'
#1613500681
curl --location --request POST 'https://booking.discovercarhire.com/api/Payment/BindTransaction?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "PaymentGateway": 2,
    "TransactionID": "67768412FN831554W",
    "Amount": 34.40,
    "CurrencyCode": "GBP",
    "ReservationNumber": "DC-1720501"
}'
#1613500720
clear
#1613500722
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data-raw '{
   "SearchUID":"332e85ff-182b-4d0a-acea-c01e92802d05",
   "CarUID":"YTGJ",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"10",
   "CoverageOfferID":10
}'
#1613500745
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
   "SearchUID":"332e85ff-182b-4d0a-acea-c01e92802d05",
   "CarUID":"YTGJ",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"103",
   "CoverageOfferID":10
}'
#1613500933
clear
#1613500935
curl --location --request POST 'https://booking.discovercarhire.com/api/Payment/BindTransaction?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "PaymentGateway": 2,
    "TransactionID": "366456349R9828214",
    "Amount": 34.40,
    "CurrencyCode": "GBP",
    "ReservationNumber": "DC-1720504"
}'
#1613501087
clear
#1613501090
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "SearchUID":"332e85ff-182b-4d0a-acea-c01e92802d05",
   "CarUID":"3UV7",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"10",
   "CoverageOfferID":10
}'
#1613501103
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "SearchUID":"332e85ff-182b-4d0a-acea-c01e92802d05",
   "CarUID":"3UV7",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"104",
   "CoverageOfferID":10
}'
#1613501376
clear
#1613501378
curl --location --request POST 'https://booking.discovercarhire.com/api/Payment/BindTransaction?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "PaymentGateway": 2,
    "TransactionID": "2B314200H5377121M",
    "Amount": 64.31,
    "CurrencyCode": "GBP",
    "ReservationNumber": "DC-1720509"
}'
#1613501518
clear
#1613501520
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "SearchUID":"14c10bde-24c1-497c-b949-d5b302e4e2b5",
   "CarUID":"AXEB",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"105",
   "CoverageOfferID":10
}'
#1613501891
clear
#1613501894
curl --location --request POST 'https://booking.discovercarhire.com/api/Payment/BindTransaction?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "PaymentGateway": 2,
    "TransactionID": "2TS52630YV441433F",
    "Amount": 117.91,
    "CurrencyCode": "GBP",
    "ReservationNumber": "DC-1720517"
}'
#1613502502
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "SearchUID":"14c10bde-24c1-497c-b949-d5b302e4e2b5",
   "CarUID":"QJDL",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"106",
   "CoverageOfferID":10
}'
#1613502553
curl --location --request POST 'https://booking.discovercarhire.com/api/Payment/BindTransaction?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "PaymentGateway": 2,
    "TransactionID": "12099568KM6493223",
    "Amount": 220.97,
    "CurrencyCode": "GBP",
    "ReservationNumber": "DC-1720537"
}'
#1613502766
clear
#1613502769
curl --location --request POST 'https://booking.discovercarhire.com/api/Reservation/Create?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "SearchUID":"681407bb-c8bb-4250-ba08-f72766a416e1",
   "CarUID":"Q6X9",
    "Title":"Mr.",
   "Name":"Rick",
   "Surname":"Little",
   "PhoneCountryCode":"+44",
   "Phone":"584512154874654",
   "Email":"rick@mail.com",
   "BirthDate":"1985-11-20T08:50:32.263Z",
   "ResidenceCountryCode":"GB",
   "FlightNumber":"123",
   "CustomerComment":"some",
   "ReferenceNumber":"108",
   "CoverageOfferID":10
}'
#1613503090
curl --location --request POST 'https://booking.discovercarhire.com/api/Payment/BindTransaction?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4=' --header 'Content-Type: application/json' --data '{
    "PaymentGateway": 2,
    "TransactionID": "8RF393924N023854K",
    "Amount": 97.69,
    "CurrencyCode": "GBP",
    "ReservationNumber": "DC-1720542"
}'
#1613503167
clear
#1613503170
curl --location --request GET 'https://booking.discovercarhire.com/api/Reservation/Cancel?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3&bookingNumber=DC-1720542' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4='
#1613503195
curl --location --request GET 'https://booking.discovercarhire.com/api/Reservation/Cancel?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3&bookingNumber=DC-1720492' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4='
#1613505784
clear
#1613505787
curl --location --request GET 'https://booking.discovercarhire.com/api/Reservation/Cancel?accessToken=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3&bookingNumber=DC-1720492' --header 'Authorization: Basic bXFUcXpGN2E0MnprOnhrczhwZ2QyUU1xQVMycU4='
#1614347082
curl --location --request POST 'https://mexrentacar.com/api/v1/getLocations' --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNkZjBkMzA2ODFjMDAxOTIxODZjNWFmNDkyNzJmZDdmYmExM2I3YTRjOTVmYzE5YWM3NGQ4MTRkNDIzZjFiYWZkYzE5MDhjY2Y4Zjk4YjI3In0.eyJhdWQiOiIzMCIsImp0aSI6ImNkZjBkMzA2ODFjMDAxOTIxODZjNWFmNDkyNzJmZDdmYmExM2I3YTRjOTVmYzE5YWM3NGQ4MTRkNDIzZjFiYWZkYzE5MDhjY2Y4Zjk4YjI3IiwiaWF0IjoxNjE0MzQ1MTExLCJuYmYiOjE2MTQzNDUxMTEsImV4cCI6MTYxNDM0ODcxMSwic3ViIjoiIiwic2NvcGVzIjpbXX0.FWh_NrLM5-QzIaTWUy_ZIt8TsuSlNSd6iGZgqam-JM82jQjPE_ioUyAunnFK4z2DqIxiUoXOKk6F9bYXrZyWfvm7t651lzXzREQin-IOgfNfE8mECk5FKNJ9gKmOx5po9eIsbxpAFjCGB3TALCdiYhlRBlGMogqT4LDlKXuivU5xbls4Np_7jG9CB_5N7LQ2ZlMCdvnF6-GXgx-0q20GMqQ3K7TpngUmYA_Eg4E6hxZsnnJsdeOu426b7l_5NN5pk0j5VzPOwZiFGXx6_c0y7oFvv_KZ6AHsYxDKe63dRn4QZ00hLSSaxyXF-IaW9olaimDtDIzLFZh73Wso6NqW8ReX3T0P2DJPnwkgS929V5b94qipHvd-tzUrwPivBwLLZpEyB-w1egkIc93D0N5OM3cW4OnV74HNSL7IfySt1hxYirrxgXjj3svB3zmMoVeDxJPtO5ve9Udr6Jcsnc4eGdjvc86E-Z-53mvC8I8wWMoZBQXYYKnuNMO4FK4hlOp2fjBzQbL5Z4JSfLPYnZNZz0eG5tiCp2QI6rR3xaM0W0uGFo52ItNPZyNScx4Xb1A_SRfoxSkcfCmyvkG-6wPHdnjbvswmVaXIZMobGruWJ1Ta_GWNheH6uV6dhzrlGP826-w8OWq0w9OP1IKl32ICkS0alC4qAmGctHK40AJ6DXU'
#1614359170
cd www/
#1614359171
ls
#1614359183
cd ota_api
#1614359187
git pull
#1614359192
pm2 status
#1614359195
pm2 restart 7
#1614359196
cd ..
#1614359206
cd ota_api_test/
#1614359215
git pull origin tes
#1614359218
git pull origin test
#1614359225
pm2 restart 8
#1614359239
pm2 logs8
#1614359244
pm2 logs 8
#1614359255
[7
#1614359259
pm2 logs 7
#1614610802
curl --location --request POST 'http://appgw.click-ins.com/rest//v1/inspections?key=56ff54d7-7045-4415-9f1c-60e5601e0b92&upload_type=MULTIPART' --header 'Content-Type: application/json' --data-raw '{
  "client_process_id": "string",
  "client_token": "string",
  "basic_vehicle_data": {
    "model": {
      "model_identifier": "string",
      "make": "string",
      "model": "string",
      "submodel": "string",
      "bodystyle": "string",
      "year": 0,
      "full_name": "string"
    },
    "example_pictures": [
      "string"
    ],
    "license_plate_number": "string"
  },
  "previous_inspection_case_id": "string",
  "features": [
    "EXIF_DATA_EXTRACTION"
  ]
}'
#1614610816
curl --location --request POST 'http://appgw.click-ins.com/rest//v1/inspections?key=56ff54d7-7045-4415-9f1c-60e5601e0b92&upload_type=MULTIPART' --header 'Content-Type: application/json' --data '{
  "client_process_id": "string",
  "client_token": "string",
  "basic_vehicle_data": {
    "model": {
      "model_identifier": "string",
      "make": "string",
      "model": "string",
      "submodel": "string",
      "bodystyle": "string",
      "year": 0,
      "full_name": "string"
    },
    "example_pictures": [
      "string"
    ],
    "license_plate_number": "string"
  },
  "previous_inspection_case_id": "string",
  "features": [
    "EXIF_DATA_EXTRACTION"
  ]
}'
#1614611319
curl --location --request POST 'http://appgw.click-ins.com/rest/v1/inspections?key=56ff54d7-7045-4415-9f1c-60e5601e0b92&upload_type=MULTIPART' --header 'Content-Type: application/json' --data '{
  "client_process_id": "string",
  "client_token": "string",
  "basic_vehicle_data": {
    "model": {
      "model_identifier": "string",
      "make": "string",
      "model": "string",
      "submodel": "string",
      "bodystyle": "string",
      "year": 0,
      "full_name": "string"
    },
    "example_pictures": [
      "string"
    ],
    "license_plate_number": "string"
  },
  "previous_inspection_case_id": "string",
  "features": [
    "EXIF_DATA_EXTRACTION"
  ]
}'
#1614617712
curl --location --request POST 'http://appgw.click-ins.com/rest/v1/inspections?key=56ff54d7-7045-4415-9f1c-60e5601e0b92&upload_type=MULTIPART' --header 'Content-Type: application/json' --data '{
"client_process_id": "string",
"client_token": "string",
"basic_vehicle_data": {
"model": {
"model_identifier": "string",
"make": "string",
"model": "string",
"submodel": "string",
"bodystyle": "string",
"year": 0,
"full_name": "string"
},
"example_pictures": [
"string"
],
"license_plate_number": "string"
},
"previous_inspection_case_id": "string",
"features": [
"EXIF_DATA_EXTRACTION"
]
}'
#1614706737
curl --location --request POST 'http://javelin-test-api.yesaway.com/services' --header 'Authorization: Basic Ym9va2luZ2NsaWs6MWFiNzQ3NmFmM2U2NmM4ODAzOTdkNGM5OWUzMDA0NzI=' --header 'Content-Type: application/xml' --data-raw '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <OTA_VehAvailRateMoreRQ ID="EN" MaxResponses="50" Production="Production" Version="3.0" onIdentifier="100000002">
            <POS>
                <Source ISOCountry="AU">
                    <RequestorID Type="4" ID="W_NZ_ORDER_COM_RR_FULLPREPAID">
                        <CompanyName Code="skyscanner" CompanyShortName="skyscanner"/>
                    </RequestorID>
                </Source>
                <Source>
                    <RequestorID Type="4" ID="00000000" ID_Context="IATA">
                        <CompanyName/>
                    </RequestorID>
                </Source>
            </POS>
            <VehAvailRQCore Status="Available">
                <VehRentalCore PickUpDateTime="2021-11-11T11:30" ReturnDateTime="2021-11-13T12:30">
                    <PickUpLocation LocationCode="CHC01" />
                    <ReturnLocation LocationCode="CHC01" />
                </VehRentalCore>
                <VendorPrefs>
                    <VendorPref Code="yesaway"/>
                </VendorPrefs>
                <DriverType Age="35"/>
                <Tpa_Extensions>
                    <TPA_Extension_Flags EnhancedTotalPrice=""/>
                    <EnhancedTotalPrice>true</EnhancedTotalPrice>
                </Tpa_Extensions>
            </VehAvailRQCore>
        </OTA_VehAvailRateMoreRQ>
    </soap:Body>
</soap:Envelope>'
#1614706780
clear
#1614706782
curl --location --request POST 'http://javelin-test-api.yesaway.com/services' --header 'Authorization: Basic Ym9va2luZ2NsaWs6MWFiNzQ3NmFmM2U2NmM4ODAzOTdkNGM5OWUzMDA0NzI=' --header 'Content-Type: application/xml' --data '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <OTA_VehAvailRateMoreRQ ID="EN" MaxResponses="50" Production="Production" Version="3.0" onIdentifier="100000002">
            <POS>
                <Source ISOCountry="AU">
                    <RequestorID Type="4" ID="W_NZ_ORDER_COM_RR_FULLPREPAID">
                        <CompanyName Code="skyscanner" CompanyShortName="skyscanner"/>
                    </RequestorID>
                </Source>
                <Source>
                    <RequestorID Type="4" ID="00000000" ID_Context="IATA">
                        <CompanyName/>
                    </RequestorID>
                </Source>
            </POS>
            <VehAvailRQCore Status="Available">
                <VehRentalCore PickUpDateTime="2021-11-11T11:30" ReturnDateTime="2021-11-13T12:30">
                    <PickUpLocation LocationCode="CHC01" />
                    <ReturnLocation LocationCode="CHC01" />
                </VehRentalCore>
                <VendorPrefs>
                    <VendorPref Code="yesaway"/>
                </VendorPrefs>
                <DriverType Age="35"/>
                <Tpa_Extensions>
                    <TPA_Extension_Flags EnhancedTotalPrice=""/>
                    <EnhancedTotalPrice>true</EnhancedTotalPrice>
                </Tpa_Extensions>
            </VehAvailRQCore>
        </OTA_VehAvailRateMoreRQ>
    </soap:Body>
</soap:Envelope>'
#1614708700
curl --location --request POST 'http://javelin-test-api.yesaway.com/services' --header 'Authorization: Basic Ym9va2luZ2NsaWs6MWFiNzQ3NmFmM2U2NmM4ODAzOTdkNGM5OWUzMDA0NzI=' --header 'Content-Type: application/xml' --data '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.opentravel.org/OTA/2003/05">
    <soap:Body>
        <OTA_VehLocSearchRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" PrimaryLangID="EN" MaxResponses="50" Target="Production" Version="3.0" TransactionIdentifier="100000002" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05">
            <POS>
                <Source ISOCountry="US">
                    <RequestorID Type="4">
                        <CompanyName Code="klook" CompanyShortName="klook"></CompanyName>
                    </RequestorID>
                </Source>
                <Source>
                    <RequestorID Type="4" ID="00000000" ID_Context="IATA"/>
                </Source>
            </POS>
            <VehLocSearchCriterion>
                <Location Code=""/>
            </VehLocSearchCriterion>
            <Vendor Code="yesaway"/>
        </OTA_VehLocSearchRQ>
    </soap:Body>
</soap:Envelope>'
#1614887143
cd www/
#1614887144
ls
#1614887154
cd ota_api
#1614887158
git pull 
#1614887162
pm2 status
#1614887166
pm2 restart 7
#1614887174
cd ..
#1614887187
cd ota_api_test/
#1614887199
git pull origin test
#1614887206
pm2 restart 8
#1614887213
pm2 logs 7
#1614890149
cd www/
#1614890156
cd ota_api
#1614890161
git pull origin master
#1614890168
pm2 status
#1614890171
pm2 restart 7
#1614890209
cd ..
#1614890222
cd ota_api_test/
#1614890254
git pull origin test
#1614890264
pm2 restart 8
#1614907518
cd www/
#1614907521
cd ota_api
#1614907523
ls
#1614907530
cd src/
#1614907531
ls
#1614907545
vim controllers/locations.controller.ts 
#1614907810
pm2 logs 7
#1614908061
cd ..
#1614908108
git pull origin master
#1614908113
git log -1
#1614908128
pm2 restart 7
#1615259934
ls
#1615259938
cd www/
#1615259938
ls
#1615259972
cd admincarrental/
#1615259973
ls
#1615259976
git pull 
#1615260001
pm2 status
#1615260036
npm i
#1615260107
pm2 logs 2
#1615260120
pm2
#1615260125
pm2 -h
#1615260187
pm2 show 3
#1615260203
pm2 start 3
#1615260205
pm2 logs 3
#1615260216
pm2 status
#1615260225
pm2 logs 4
#1615260237
pm2 show 4
#1615260251
pm2 show 2
#1615260268
cd ..
#1615260268
ls
#1615260270
cd ..
#1615260273
cd www/
#1615260279
cat .htaccess 
#1615260314
pm2 status
#1615260317
pm2 restart 2
#1615260320
pm2 logs 2
#1615260339
pm2 status
#1615260345
pm2 status
#1615260348
pm2 status
#1615260375
kill -9 $(lsof -t -i:3029)
#1615260384
pm2 logs 2
#1615260418
pm2 show 2
#1615260442
cd ..
#1615260448
cd public_html/
#1615260449
ls
#1615260455
cd admincarrental/
#1615260456
git pull
#1615260474
pm2 status
#1615260489
pm2 logs 3
#1615260498
pm2 stop 3
#1615260500
pm2 logs 23
#1615260503
pm2 logs 2
#1615260513
cd ..
#1615260520
cat .htaccess 
#1615260617
pm2 logs 3
#1615260622
pm2 logs 2
#1615260791
pm2 logs 2
#1615260821
kill -9 $(lsof -t -i:3029)
#1615260832
pm2 status
#1615260842
pm2 restart 2
#1615260846
pm2 logs 2
#1615260860
pm2 stat us
#1615260863
pm2 status
#1615260880
pm2 logs 7
#1615260892
pm2 logs
#1615260922
cat .htaccess 
#1615260965
pm2 status
#1615260969
pm2 logs 
#1615260992
cat .htaccess 
#1615261007
kill -9 $(lsof -t -i:3010)
#1615261071
netstat --listen
#1615261121
lsof -iTCP -sTCP:LISTEN
#1615261177
netstat -tulpn | grep LISTEN
#1615261199
pm2 status
#1615261207
pm2 stop 2
#1615261211
netstat -tulpn | grep LISTEN
#1615261228
ls
#1615261231
cd ..
#1615261232
ls
#1615261246
cd www/
#1615261247
ls
#1615261258
cd admincarrental/
#1615261270
pm2 status
#1615261277
pm2 start 3
#1615261281
pm2 logs 3
#1615261336
ls
#1615261347
cat index.js 
#1615261466
git pull
#1615261482
pm2 restart 3
#1615261486
pm2 logs 3
#1615261624
git pull
#1615261637
pm2 restart 3
#1615261646
pm2 logs 3
#1615261671
git pull
#1615261687
pm2 restart 3
#1615261690
[,2 ;pgs 3
#1615261693
pm2 logs 3
#1615308392
cd www/
#1615308393
ls
#1615308410
cd ota_api_test/
#1615308467
git pull origin test
#1615308561
pm2 status
#1615308565
pm2 restart 8
#1615308577
pm2 logs 8
#1615320074
cd www/
#1615320080
de ota_api_test/
#1615320085
cd ota_api_test/
#1615320090
git pull origin test
#1615320094
pm2 restartr 8
#1615320097
pm2 restart 8
#1615320450
git pull origin test
#1615320453
pm2 restart 8
#1615322930
cd www/
#1615322935
cd ota_api_test/
#1615322937
git pull
#1615322943
git status
#1615322947
git merge abort
#1615322951
git merge --abort
#1615322953
git merge abort
#1615322956
git status
#1615322965
git pull origin test
#1615322970
pm2 restart 8
#1615323014
pm2 logs 8
#1615323739
git pull origin test
#1615323747
pm2 restart 8
#1615323751
pm2 logs 8
#1615323805
git pull origin test
#1615323809
pm2 restart 8
#1615323865
git pull origin test
#1615323868
pm2 restart 8
#1615323931
git pull origin test
#1615323941
pm2 restart 8
#1615384473
cd www/
#1615384477
cd ota_api_test/
#1615384483
git pull origin test
#1615384488
pm2 restart 8
#1615388130
cd www/
#1615388133
cd ota_api_test/
#1615388136
git pull origin tes
#1615388143
git pull origin testy
#1615388144
git pull origin test
#1615388149
pm2 restart 8
#1615388273
git pull origin test
#1615388277
pm2 restart 8
#1615391700
git pull origin test
#1615391704
pm2 restart 8
#1615392569
git pull origin test
#1615392580
pm2 restart 8
#1615393390
cd ..
#1615393397
cd ota_api
#1615393402
git pull origin master
#1615393414
pm2 status
#1615393417
pm2 restart 7
#1615393425
pm2 logs 7
#1615487532
cd www/
#1615487538
cd ota_api_test/
#1615487554
git pull origin test
#1615487558
pm2 restart 8
#1615493011
git pull origin test
#1615493029
pm2 restart 8
#1615493184
git pull origin test
#1615493195
git pull origin test
#1615493200
pm2 restart 8
#1615496069
git pull origin test
#1615496180
git pull origin test
#1615496185
pm2 restart 8
#1615496200
pm2 logs 8
#1615497029
git pull origin test
#1615497032
pm2 logs 8
#1615497035
pm2 restart 8
#1615497134
git pull origin test
#1615497138
pm2 restart 8
#1615497609
git pull origin test
#1615497612
pm2 restart 8
#1615812653
ls
#1615812654
cd www/
#1615812654
ls
#1615812659
cd ota_api
#1615812663
git pull
#1615812674
pm2 status
#1615812680
pm2 restart 7
#1615813544
git pull
#1615813547
pm2 restart 7
#1615816420
cd www/
#1615816425
cd ota_api
#1615816427
git pull
#1615816431
pm2 restart 7
#1615817522
cd www/
#1615817526
cd ota_api
#1615817528
git pull
#1615817530
pm2 restart 7
#1615817535
pm2 logs 7
#1615901715
pm2 restart 7
#1615902832
cd www/
#1615902837
cd ota_api
#1615902839
git pull
#1615902857
git checkout src/carSearchUtils/
#1615902859
git pull
#1615902865
pm2 restart 7
#1615902886
pm2 logs 7
#1615903069
git pull
#1615903073
pm2 restart 7
#1615913999
ls
#1615914001
cd www/
#1615914011
cd ota_api
#1615914014
git pull
#1615914020
pm2 restart 7
#1616176955
ls
#1616176974
ls
#1616176975
cd www/
#1616176975
ls
#1616176980
cd ota_api
#1616176983
cd ..
#1616176988
cd ota_api_test
#1616176989
ls
#1616176995
git pull inspection
#1616177006
git pull origin inspection
#1616177019
ls
#1616177024
pm2 status
#1616177028
pm2 restart 8
#1616177054
pm2 logs 8
#1616177075
ls
#1616177080
cd src/services/
#1616177081
ls
#1616177122
nano i.js
#1616177153
ls
#1616177155
node i,js
#1616177158
node i.js
#1616179776
vim i.js 
#1616179810
node i.js
#1616179952
vim i.js 
#1616179978
node i.js
#1616423892
ls
#1616423894
cd www/
#1616423895
ls
#1616423899
cd ota_api
#1616423901
git pull
#1616423907
pm2 status
#1616423909
pm2 restart 7
#1616428156
ls
#1616428157
cd www/
#1616428157
ls
#1616428160
cd ota_api
#1616428161
git pull
#1616428166
pm2 restart 7
#1616437673
git pull
#1616437677
pm2 restart 7
#1616442239
git pull
#1616442250
pm2 restart 7
#1616444752
cd www/
#1616444753
ls
#1616444755
cd ota_api
#1616444758
git pull
#1616444763
pm2 restart 7
#1616444782
pm2 logs 7
#1616445689
git pull
#1616445693
pm2 restart 7
