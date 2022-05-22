<?php
/*
Plugin Name:	Montagsleser Rest API
Plugin URI:		https://echtkleinemedien.de
Description:	Custom Rest API für montagsleser.de
Version:		1.0.0
Author:			Richard
Author URI:		https://echtkleinemedien.de
License:		GPL-2.0+
License URI:	http://www.gnu.org/licenses/gpl-2.0.txt

This plugin is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

This plugin is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with This plugin. If not, see {URI to Plugin License}.
*/


function mon_many_posts() {
	$args = [
		'numberposts' => 2,
		'post_type' => 'kunstwerk'
	];

	$posts = get_posts($args);

	$data = [];
	$i = 0;
	// $folder = "https://montagsleser.de/uploads/";

	foreach($posts as $post) {
		$data[$i]['id'] = $post->ID;
		$data[$i]['title'] = $post->post_title;
		$data[$i]['klappentext'] = get_field('klappentext', $post->ID);
		$data[$i]['von'] = get_field('von', $post->ID)[0]->post_title;
		// get_field('wiring_diagram_thumbnail')['sizes']['thumbnail']
		$data[$i]['mit'] = get_field('mit', $post->ID)->post_title;
 
		//$data[$i]['mit'] = array(foreach($versuch as {get_field('mit', $post->ID)[0]->post_title)};
		foreach($div as $divi => $value) {
    echo '<br/>'. $divi.' : '. $value['stats']['dividendRate'];
}
		$data[$i]['kategorie'] = get_field('kategorie', $post->ID)[0]->post_title;
		$data[$i]['kompilation'] = get_field('kompilation', $post->ID)[0]->post_title;
		$data[$i]['mp3'] = get_field('mp3', $post->ID);
		$data[$i]['mp3Upload'] = get_field('mp3Upload', $post->ID);
		// $data[$i]['mp3UrlNew'] = $urlprefix.get_field('mp3', $post->ID);
		$data[$i]['bild'] = get_field('bild', $post->ID);
		$data[$i]['bildUpload'] = get_field('bildUpload', $post->ID);
		$data[$i]['ersteWorte'] = get_field('ersteWorte', $post->ID);
		$data[$i]['hervorgehoben'] = get_field('hervorgehoben', $post->ID);
		$data[$i]['videolink'] = get_field('videolink', $post->ID);
		$data[$i]['text'] = get_field('text', $post->ID);
		
		$i++;
	}

	return $data;
}

function mon_single_posts( $slug ) {
	$args = [
		'name' => $slug['slug'],
		'post_type' => 'kunstwerk'
	];

	$post = get_posts($args);


	$data['id'] = $post[0]->ID;
	$data['title'] = $post;
	$data['slug'] = $post[0]->post_name;

	return $data;
}

// Used in this video https://www.youtube.com/watch?v=76sJL9fd12Y
function wl_products() {
	$args = [
		'numberposts' => 1000,
		'post_type' => 'products'
	];

	$posts = get_posts($args);

	$data = [];
	$i = 0;

	foreach($posts as $post) {
		$data[$i]['id'] = $post->ID;
		$data[$i]['title'] = $post->post_title;
        $data[$i]['slug'] = $post->post_name;
        $data[$i]['price'] = get_field('price', $post->ID);
        $data[$i]['delivery'] = get_field('delivery', $post->ID);
		$i++;
	}

	return $data;
}

add_action('rest_api_init', function() {
	register_rest_route('mon/v1', 'kunstwerk', [
		'methods' => 'GET',
		'callback' => 'mon_many_posts',
	]);

	register_rest_route( 'mon/v1', 'kunstwerk/(?P<slug>[a-zA-Z0-9-]+)', array(
		'methods' => 'GET',
		'callback' => 'mon_single_posts',
    ) );
    
    // Used in this video: https://www.youtube.com/watch?v=76sJL9fd12Y	
    register_rest_route('wl/v1', 'kunstwerk', [
		'methods' => 'GET',
		'callback' => 'wl_products',
	]);
});