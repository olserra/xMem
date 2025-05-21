#!/bin/bash

QDRANT_URL="https://e1d45360-76fe-4a7b-b769-f59ced8c7b0f.eu-west-1-0.aws.cloud.qdrant.io:6333"
COLLECTION="xmem_collection"
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.eyIIvmECLQ7wy6H09Kx4xmWaD-gvr_VwEJr07bkiYw8"

# You can change VECTOR_DIM to match your collection's vector size
VECTOR_DIM=4

generate_vector() {
  local dim=$1
  local vec="["
  for ((j=1;j<=dim;j++)); do
    val=$(awk -v min=0 -v max=1 'BEGIN{srand(); print min+rand()*(max-min)}')
    vec+="$val"
    if [ $j -lt $dim ]; then
      vec+=", "
    fi
  done
  vec+="]"
  echo "$vec"
}

random_phrase() {
  phrases=("apple pie" "banana split" "carrot cake" "date shake" "elderberry jam" "fig tart" "grape soda" "honeydew smoothie" "kiwi sorbet" "lemon curd" "mango salsa" "nectarine crisp" "orange marmalade" "papaya salad" "quince jelly" "raspberry mousse" "strawberry shortcake" "tomato soup" "ugli fruit punch" "vanilla pudding" "watermelon slush" "xigua salad" "yam fries" "zucchini bread")
  echo "${phrases[$RANDOM % ${#phrases[@]}]}"
}

points="["
for i in $(seq 1 50); do
  vector=$(generate_vector $VECTOR_DIM)
  phrase=$(random_phrase)
  number=$((RANDOM % 100))
  flag=$([ $((RANDOM % 2)) -eq 0 ] && echo "true" || echo "false")
  points+="{\"id\":$i,\"vector\":$vector,\"payload\":{\"text\":\"$phrase\",\"number\":$number,\"flag\":$flag}}"
  if [ $i -lt 50 ]; then
    points+=","
  fi
done
points+="]"

json="{\"points\":$points}"

curl -X PUT "$QDRANT_URL/collections/$COLLECTION/points?wait=true" \
  -H "Content-Type: application/json" \
  -H "api-key: $API_KEY" \
  -d "$json"