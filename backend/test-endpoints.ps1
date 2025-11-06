# Test Script for Problem CRUD Endpoints
# Make sure Spring Boot is running on port 8080 before executing

$baseUrl = "http://localhost:8080/api/problems"

Write-Host "`n=== Testing CRUD Endpoints ===" -ForegroundColor Cyan

# Test 1: CREATE - Add a new problem
Write-Host "`n1. Testing POST /api/problems (Create)" -ForegroundColor Yellow
$problem1 = @{
    title = "Two Sum"
    description = "Find two numbers that add up to target"
    difficulty = "Easy"
    platform = "LeetCode"
    url = "https://leetcode.com/problems/two-sum/"
    lastReviewed = "2025-11-06"
    nextReview = "2025-11-08"
    reviewCount = 1
    notes = "Use hashmap for O(n) solution"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $problem1 -ContentType "application/json"
    Write-Host "✓ Created problem with ID: $($response1.id)" -ForegroundColor Green
    $createdId = $response1.id
} catch {
    Write-Host "✗ Failed to create problem: $_" -ForegroundColor Red
    exit 1
}

# Test 2: CREATE - Add another problem
Write-Host "`n2. Testing POST /api/problems (Create second problem)" -ForegroundColor Yellow
$problem2 = @{
    title = "Binary Search"
    description = "Find target in sorted array"
    difficulty = "Easy"
    platform = "LeetCode"
    url = "https://leetcode.com/problems/binary-search/"
    reviewCount = 0
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $problem2 -ContentType "application/json"
    Write-Host "✓ Created problem with ID: $($response2.id)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create second problem: $_" -ForegroundColor Red
}

# Test 3: READ ALL - Get all problems
Write-Host "`n3. Testing GET /api/problems (Read All)" -ForegroundColor Yellow
try {
    $allProblems = Invoke-RestMethod -Uri $baseUrl -Method Get
    Write-Host "✓ Retrieved $($allProblems.Count) problems" -ForegroundColor Green
    $allProblems | ForEach-Object {
        Write-Host "  - ID: $($_.id), Title: $($_.title), Difficulty: $($_.difficulty)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed to retrieve problems: $_" -ForegroundColor Red
}

# Test 4: READ ONE - Get problem by ID
Write-Host "`n4. Testing GET /api/problems/{id} (Read One)" -ForegroundColor Yellow
try {
    $singleProblem = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Get
    Write-Host "✓ Retrieved problem: $($singleProblem.title)" -ForegroundColor Green
    Write-Host "  Platform: $($singleProblem.platform)" -ForegroundColor Gray
    Write-Host "  Notes: $($singleProblem.notes)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to retrieve problem: $_" -ForegroundColor Red
}

# Test 5: UPDATE - Update a problem
Write-Host "`n5. Testing PUT /api/problems/{id} (Update)" -ForegroundColor Yellow
$updatedProblem = @{
    title = "Two Sum - Updated"
    description = "Find two numbers that add up to target - optimized"
    difficulty = "Easy"
    platform = "LeetCode"
    url = "https://leetcode.com/problems/two-sum/"
    lastReviewed = "2025-11-06"
    nextReview = "2025-11-09"
    reviewCount = 2
    notes = "Use hashmap for O(n) solution. Remember edge cases!"
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Put -Body $updatedProblem -ContentType "application/json"
    Write-Host "✓ Updated problem: $($updated.title)" -ForegroundColor Green
    Write-Host "  New review count: $($updated.reviewCount)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to update problem: $_" -ForegroundColor Red
}

# Test 6: DELETE - Delete a problem
Write-Host "`n6. Testing DELETE /api/problems/{id} (Delete)" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Delete
    Write-Host "✓ Deleted problem with ID: $createdId" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to delete problem: $_" -ForegroundColor Red
}

# Test 7: Verify deletion - Try to get deleted problem
Write-Host "`n7. Verifying deletion (should return 404)" -ForegroundColor Yellow
try {
    $deletedProblem = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Get
    Write-Host "✗ Problem still exists (should have been deleted)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✓ Confirmed: Problem was deleted (404 Not Found)" -ForegroundColor Green
    } else {
        Write-Host "✗ Unexpected error: $_" -ForegroundColor Red
    }
}

# Test 8: Get remaining problems
Write-Host "`n8. Final check - Get remaining problems" -ForegroundColor Yellow
try {
    $finalProblems = Invoke-RestMethod -Uri $baseUrl -Method Get
    Write-Host "✓ Total problems remaining: $($finalProblems.Count)" -ForegroundColor Green
    $finalProblems | ForEach-Object {
        Write-Host "  - ID: $($_.id), Title: $($_.title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed to retrieve final problems: $_" -ForegroundColor Red
}

Write-Host "`n=== All Tests Complete ===" -ForegroundColor Cyan
