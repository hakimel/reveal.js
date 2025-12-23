<?php
header('Content-Type: application/json; charset=utf-8');

$topic = isset($_POST['topic']) ? trim($_POST['topic']) : 'Untitled Topic';
$num   = isset($_POST['num']) ? (int)$_POST['num'] : 5;
if ($num < 1) $num = 1;
if ($num > 15) $num = 15;

function makePoints($topic, $count) {
    $pts = [];
    $verbs = ['Explain', 'Highlight', 'Discuss', 'Show', 'Explore', 'Compare'];
    $areas = ['benefits', 'challenges', 'examples', 'applications', 'future trends'];
    for ($i=0; $i<$count; $i++) {
        $v = $verbs[array_rand($verbs)];
        $a = $areas[array_rand($areas)];
        $pts[] = "$v $a of $topic";
    }
    return $pts;
}

$slides = [];
$slides[] = [
  'title' => $topic,
  'subtitle' => 'AI Generated Slide Deck',
  'points' => ["Prepared on ".date('Y-m-d')]
];

for ($i=1; $i<$num-1; $i++) {
    $slides[] = [
      'title' => "$topic — Section $i",
      'subtitle' => 'Key ideas',
      'points' => makePoints($topic, 3)
    ];
}

if ($num > 1) {
    $slides[] = [
      'title' => 'Conclusion',
      'subtitle' => '',
      'points' => makePoints($topic, 3)
    ];
}

echo json_encode(['slides' => $slides], JSON_UNESCAPED_UNICODE);
