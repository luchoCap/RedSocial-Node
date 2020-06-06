$('#post-comment').hide()
$('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
})

$('#btn-like').click(function(e){  
    e.preventDefault();
    let imgID = $(this).data('id');
    console.log(imgID)
    $.post('/images/' + imgID + '/like')
        .done(data=>{
            console.log(data);
            $('.likes-count').text(data.likes)
        })
});

$('#btn-delete').click(function(e){
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Are you sure you want to delete this image?');
    if(response){
        let imgID = $this.data('id')
        $.ajax({
            url:'/images/' + imgID,
            type: 'DELETE'
        })
        .done(function(result){
            $this.removeClass('btn-danger').addClass('btn-success');
            $this.find('i').removeClass('fa-times').addClass('fa-check');
          
        })
    }
})