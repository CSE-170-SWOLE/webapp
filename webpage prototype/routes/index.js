
/*
 * GET home page.
 */

exports.view = function(req, res){
  res.render('index', {
	  'projects': [
	  { 'name': 'ARMS Workout',
	    'image': 'arms.jpg',
		'id': 'project1'
	  },
	  { 'name': 'LEGS Workout',
	    'image': 'legs.jpg',
		'id': 'project2'
	  },
	  { 'name': 'ABS Workout',
	    'image': 'abs.jpg',
		'id': 'project3'
	  },
	  { 'name': 'Create New Workout',
	    'image': 'plus.jpg',
		'id': 'project4' 
	  },
	  ]
  });
};