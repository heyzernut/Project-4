$(document).ready(function(){
  $('#example').DataTable();
});

$('#selectLocation').on('change',function(){
     if( $(this).val()==="Warehouse"){
     $("#otherType").show()
     }
     else{
     $("#otherType").hide()
     $("#Zone").val('')
     $("#Shelf").val('')
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

  $('#trackingStatus').on('change',function(){
       if( $(this).val()==="Received with issues"){
       $("#trackingComment").show()
       }
       else{
       $("#trackingComment").hide()
       $("#textAreaForTrackingComment").val('')
       }
   });

  // var FormStuff = {
  //
  //   init: function() {
  //     // kick it off once, in case the radio is already checked when the page loads
  //     this.applyConditionalRequired();
  //     this.bindUIActions();
  //   },
  //
  //   bindUIActions: function() {
  //     // when a radio or checkbox changes value, click or otherwise
  //     $("input[type='radio'], input[type='checkbox']").on("change", this.applyConditionalRequired);
  //   },
  //
  //   applyConditionalRequired: function() {
  //     // find each input that may be hidden or not
  //     $(".require-if-active").each(function() {
  //       var el = $(this);
  //       // find the pairing radio or checkbox
  //       if ($(el.data("require-pair")).is(":checked")) {
  //         // if its checked, the field should be required
  //         el.prop("required", true);
  //       } else {
  //         // otherwise it should not
  //         el.prop("required", false);
  //       }
  //     });
  //   }
  //
  // };
  // FormStuff.init();

// }
