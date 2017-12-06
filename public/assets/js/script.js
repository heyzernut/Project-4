$(document).ready(function(){
  $('#example').DataTable();
});

$('#selectLocation').on('change',function(){
     if( $(this).val()==="Warehouse"){
     $("#otherType").show()
     }
     else{
     $("#otherType").hide()
     }
 });
