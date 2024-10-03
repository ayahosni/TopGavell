<form method="POST" action="{{ route('checkout', ['auctionID' => 3, 'bidderID' => 2]) }}" class="mt-5" enctype="multipart/form-data">
    @csrf
    <button type="submit">checkout</button>

</form>
