function envato_register_rest_fields(){
 
 register_rest_field('tutorial',
     'tutorial_category_attr',
     array(
         'get_callback'    => 'envato_tutorial_categories',
         'update_callback' => null,
         'schema'          => null
     )
 );

 register_rest_field('tutorial',
     'tutorial_tag_attr',
     array(
         'get_callback'    => 'envato_tutorial_tags',
         'update_callback' => null,
         'schema'          => null
     )
 );

 register_rest_field('tutorial',
     'tutorial_image_src',
     array(
         'get_callback'    => 'envato_tutorial_image',
         'update_callback' => null,
         'schema'          => null
     )
 );

}
add_action('rest_api_init','envato_register_rest_fields');

