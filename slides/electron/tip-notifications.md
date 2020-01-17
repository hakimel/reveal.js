#### Tip: notifications

```javascript
// www/js/script.js

const btnNotification = document.getElementById('btnNotification');
btnNotification.onclick = () => {

  const myNotification = new Notification('Title', {
    body: 'Lorem Ipsum Dolor Sit Amet'
  })
  myNotification.onclick = () => {
    console.log('Notification clicked')
  }

}
```

<aside class="notes">
</aside>
