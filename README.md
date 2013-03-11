xpopup
======

JavaScript PopUp full control.

Use
===

    // Open URL in PopUp: page.php?id=123
    var p = xpopup({
        url: 'page.php',
        data: {
            id: 123
        },
        width: 400,
        height: 400,
        modal: true, // Block UI and show PopUp
        close: function() {
            alert('Popup closed!');
        }
    });
    
    // Center PopUp in screen
    p.center();
    
    // Check if PopUp is closed
    if (p.closed()) {
        alert('PopUp closed!');
    } else {
        // Set PopUp focus
        p.focus();
        // Maximize PopUp
        p.maximize();
    }
