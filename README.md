# Kullanıcı Yönetim Projesi

## Proje Açıklaması
Bu proje, JavaScript ile localStorage ve sessionStorage kullanarak kullanıcı verilerini yönetir. Aşağıda projenin detayları açıklanmıştır.

## Özellikler
- **appendLocation Değişkeni:** Projenin başında tanımlanan `appendLocation` değişkenine bir selector atanır. Bu selector dinamik olarak değiştirilebilir. Çekilen tüm kullanıcı verileri bu selector’un altına eklenir.
- **LocalStorage Kullanımı:** Kullanıcı verileri localStorage içerisinde expire süresi olmadan saklanır.
- **Kullanıcı Silme:** Kullanıcıların tek tek silinmesine olanak sağlanır.
- **Tüm Kullanıcılar Silinirse:** Eğer tüm kullanıcılar silinirse, veri yeniden çekilebilsin diye bir buton gösterilir. Bu buton `MutationObserver` kullanılarak yönetilir.
- **Tek Seferlik Veri Çekme:** Kullanıcı bu butona tıkladığında, sessionStorage’a bir değer eklenir. Aynı oturumda bu buton yalnızca bir kez kullanılabilir.

## Kullanım
1. `index.html` dosyasını açın veya JS dosyasını direkt console’a yapıştırarak test edin.
2. `appendLocation` değişkenini ihtiyacınıza göre güncelleyin.

## Teknolojiler
- JavaScript
- localStorage & sessionStorage
- MutationObserver

## Notlar
- Eğer tüm kullanıcılar silinirse, buton yalnızca oturum boyunca bir kez görünecektir.
- Proje sadece tek bir JS dosyası ile çalışır, ek bir yapılandırma gerektirmez.
