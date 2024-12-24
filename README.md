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