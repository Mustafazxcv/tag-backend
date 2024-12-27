# Kullanıcı Kayıt Fonksiyonu

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/users/register


Body (JSON):
{
  "phone_number": "+905551112233"
}


Başarılı Yanıt:
{
  "id": 1
}

Olası Hatalar:
409: Telefon numarası zaten kayıtlı.
400: Telefon numarası gönderilmedi.



"first_name": "Ali",
  "last_name": "Veli",
  "birth_date": "1990-01-01",
  "email": "ali.veli@example.com"





# Kullanıcı Giriş Fonksiyonu

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/users/login


Body (JSON):
{
  "phone_number": "+905551112233"
}


Başarılı Yanıt:
{
  "auth": true,
  "token": "JWT_TOKEN_HERE"
}

# Kullanıcı Bilgilerini Düzenleme Fonksiyonu

HTTP Metodu: PUT
Endpoint: http://127.0.0.1:3000/api/users/update

Headers:
{
  "Authorization": "Bearer JWT_TOKEN_HERE"
}


Body (JSON):
{
  "first_name": "Ali",
  "last_name": "Veli",
  "birth_date": "1990-01-01",
  "email": "ali.veli@example.com"
}

veya tek tek güncellenebilir.

{
  "first_name": "Ali"
}

{
  "last_name": "Veli"
}
{
  "birth_date": "1990-01-01"
}

{
  "email": "ali.veli@example.com"
}

Başarılı Yanıt:
Kullanıcı bilgileri güncellendi.


Olası Hatalar:
400: Güncellenecek bir bilgi yok.
401: Geçersiz token.
403: Token gönderilmedi.

# Admin Kayıt Fonksiyonu 

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/admins/register

Body (JSON):
{
  "username": "admin",
  "password": "admin"
}


# Admin Giriş Fonksiyonu

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/admins/login

Body (JSON):
{
  "username": "admin",
  "password": "securepassword"
}

Response:
{
  "auth": true,
  "token": "JWT_TOKEN_HERE"
}

# Fatura Adresi Ekleme

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/billing-addresses/add

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

Body (JSON):
{
  "city": "İstanbul",
  "district": "Kadıköy",
  "neighborhood": "Feneryolu",
  "address": "Feneryolu Sok. No:12"
}

# Kullanıcıya Ait Fatura Adresini Getirme

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/billing-addresses/

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

# İletişim İzinleri Ekleme

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/communication/permissions

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

Body (JSON):
{
  "email_permission": true,
  "sms_permission": false,
  "phone_permission": true
}

# İletişim İzinlerini Getirme

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/communication/permissions

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

# Bildirim Gönderme İşlemi (Admin)

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/notifications/send

Headers:
{
  "Authorization": "Bearer ADMIN_TOKEN"
}

Body (JSON):
{
  "title": "Sistem Güncellemesi",
  "text": "Sistem bakımı yapılacaktır. Lütfen dikkatli olunuz."
}

# Bildirim Getirme İşlemi (Genel)

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/notifications/list

Başarılı Yanıt:
[
  {
    "id": 1,
    "title": "Sistem Güncellemesi",
    "text": "Sistem bakımı yapılacaktır. Lütfen dikkatli olunuz.",
    "created_at": "2024-12-25T10:00:00.000Z",
    "admin_username": "admin1"
  }
]

# Kullanıcı Bakiyesini Getirme 

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/balance/

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

Başarılı Yanıt:
{
  "balance": 100.00
}

# Kullanıcıya Bakiye Ekleme

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/balance/load

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

Body (JSON):
{
  "amount": 50.00
}

# Kullanıcı Bakiyesi ve Son İşlemleri Getir

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/balance/transactions

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

# Kullanıcı Bilgilerini Getirme

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/users/info

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

# Admin Son Giriş Bilgilerini Getirme

HTTP Metodu: GET

Endpoint: http://127.0.0.1:3000/api/admins/history

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

# Kullanıcılar Arası Bakiye Gönderme İşlemi

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/balance/transfer-by-phone

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

Body (JSON):
{
  "phone_number": "+905551112233",
  "amount": 50.00
}

# Telefon Numarası Sorgulama 

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/users/check-phone

Body (JSON):
{
  "phone_number": "+905551112233"
}

# Scooter Listeleme

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/scooters/all

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

# Scooterı Güncelleme 

HTTP Metodu: PUT
Endpoint: http://127.0.0.1:3000/api/scooters/update/:id

Body (JSON):
{
  "serial_number": "SC54321",
  "model": "Xiaomi Pro",
  "year": 2025,
  "battery_level": 80,
  "price_per_hour": 25.00,
  "latitude": 41.038285,
  "longitude": 29.015755,
  "status": "maintenance"
}


# Scooter Ekleme (Admin)

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/scooters/add

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

Body (JSON):
{
  "serial_number": "SC12345",
  "model": "Xiaomi M365",
  "year": 2024,
  "battery_level": 100,
  "price_per_hour": 20.50,
  "latitude": 41.015137,
  "longitude": 28.979530,
  "status": "available"
}

# Scooter Kullanmaya Başla

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/rentals/rent

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

Body (JSON):
{
  "scooter_id": 1,
  "duration": 2,
  "total_price": 40.00
}

# Kullanıcı Hangi Scooter Kullanımda

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/rentals/current-scooter

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}

# Scooterı Bırakma Fonksiyonu 

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/rentals/end-rental

Headers:
{
  "Authorization": "Bearer JWT_TOKEN"
}
Body (JSON):
{
  "scooter_id": 1,
  "latitude": 41.015137,
  "longitude": 28.979530,
  "battery_level": 45
}

# Scooter Hangi Şehirde İstiyorsun

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/locations/increment

Body (JSON):
{
  "latitude": 41.015137,
  "longitude": 28.979530
}

# Gmail Kaydetme Fonksiyonu

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/function/gmail

Body (JSON):
{
  "email": "example@gmail.com"
}

# İletişim Bilgileri Ekleme 

HTTP Metodu: POST
Endpoint: http://127.0.0.1:3000/api/function/contact

Body (JSON):
{
  "first_name": "Ali",
  "last_name": "Veli",
  "phone_number": "1234567890",
  "email": "example@gmail.com",
  "subject": "Örnek Başlık",
  "message": "Bu bir örnek mesajdır."
}

# İletişim Bilgilerini Görüntüleme

HTTP Metodu: GET
Endpoint: http://127.0.0.1:3000/api/function/contact

Başarılı Yanıt (Örnek):
{
  "message": "İletişim mesajları başarıyla alındı.",
  "records": [
    {
      "id": 1,
      "first_name": "Ali",
      "last_name": "Veli",
      "phone_number": "1234567890",
      "email": "example@gmail.com",
      "subject": "Örnek Başlık",
      "message": "Bu bir örnek mesajdır.",
      "created_at": "2024-12-24T12:00:00.000Z"
    },
    {
      "id": 2,
      "first_name": "Ayşe",
      "last_name": "Yılmaz",
      "phone_number": "9876543210",
      "email": "another@gmail.com",
      "subject": "Başka Bir Başlık",
      "message": "Başka bir örnek mesajdır.",
      "created_at": "2024-12-24T13:00:00.000Z"
    }
  ]
}