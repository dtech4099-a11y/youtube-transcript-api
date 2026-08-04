$rapidApiKey = "97696daab0msh817170f2d43866bp174945jsn7a54b0e056e4"
$rapidApiHost = "youtube-transcript27.p.rapidapi.com"
$url = "https://youtube-transcript27.p.rapidapi.com/api/health"

for ($i = 1; $i -le 105; $i++) {
  try {
    $response = Invoke-RestMethod $url -Headers @{
      "x-rapidapi-key" = $rapidApiKey
      "x-rapidapi-host" = $rapidApiHost
    }

    Write-Host "Request ${i}: SUCCESS" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
  }
  catch {
    Write-Host "Request ${i}: FAILED" -ForegroundColor Red

    if ($_.Exception.Response) {
      Write-Host "Status Code:" $_.Exception.Response.StatusCode.value__
      Write-Host "Status Description:" $_.Exception.Response.StatusDescription
    }

    if ($_.ErrorDetails.Message) {
      Write-Host "Body:" $_.ErrorDetails.Message
    } else {
      Write-Host "Error:" $_.Exception.Message
    }
  }

  Start-Sleep -Milliseconds 300
}