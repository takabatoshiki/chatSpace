$(function(){
  function buildHTML(message){
    var showImage = "";
    if (message.image) {
      showImage = `<img src="${message.image}" class="message__content__image">`
    }
    var html = `<div class="message" data-message-id="${message.id}">
                  <div class="message__info">
                    <p class="name">${message.name}</p>
                    <p class="date">${message.date}</p>
                  </div>
                  <div class="message__content">
                    <p class="description">${message.content}</p>
                    ${showImage}
                  </div>
                </div>`;
    return html;
  }

  function scroll(){
    $('.main_contents').animate({ scrollTop: $('.main_contents')[0].scrollHeight});
  }

  var interval = setInterval(autoUpdate, 5000);

  function autoUpdate(){
    if (location.href.match(/\/groups\/\d+\/messages/)) {
      var messageId = $(".message").last().attr('data-message-id');
      $.ajax({
        url: location.href,
        dataType: 'json',
        data: { id: messageId }
      })
      .done(function(data){
        var id = $('.message').data('messageId');
        var insertHTML = "";
        data.forEach(function(message){
          if (message.id > id){
            insertHTML += buildHTML(message);
          }
        });
        $('.main_contents').append(insertHTML);
        scroll();
      })
      .fail(function() {
        alert("自動更新に失敗しました");
        clearInterval(interval);
      })
    }
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    if ($('.form__message').val() == ""){
      alert("コメントを入力してください");
      return false;
    }
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.main_contents').append(html);
      $('.form__submit').prop("disabled", false);
      scroll();
      $('#new_message')[0].reset();
    })
    .fail(function(){
      alert("メッセージの送信に失敗しました");
    });
  });
});