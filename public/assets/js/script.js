$('#selectLocation').on('change',function(){
     if( $(this).val()==="Warehouse"){
     $("#otherType").show()
     }
     else{
     $("#otherType").hide()
     }
 });

 $('#orderType').on('change',function(){
      if( $(this).val()==="demo"){
      $("#returnDate").show()
      }
      else{
      $("#returnDate").hide()
      }
  });
