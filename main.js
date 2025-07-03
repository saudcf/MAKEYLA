// تمرير سلس عند الضغط على روابط الدعم الفني فقط
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.support-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const el = document.getElementById('support');
            if (el) {
                e.preventDefault();
                el.scrollIntoView({behavior:'smooth'});
            }
        });
    });
});

// إشعار بسيط (Toast) للاستخدام العام
function showToast(msg, color = "#1976d2") {
    let toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = "position:fixed;bottom:32px;right:32px;background:" + color + ";color:#fff;padding:14px 28px;border-radius:8px;font-size:1.1rem;z-index:9999;box-shadow:0 2px 12px #0003;opacity:0.97;";
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
}

// منع تكرار إرسال نموذج الدفع
window.preventDoubleSubmit = function(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function(e) {
        if (form.dataset.submitted) {
            e.preventDefault();
            showToast("تم إرسال الطلب بالفعل", "#d32f2f");
        } else {
            form.dataset.submitted = "true";
        }
    });
};

// تحقق من صحة رقم الجوال السعودي
window.isValidSaudiMobile = function(number) {
    return /^05\d{8}$/.test(number);
};

// مثال: ربط منع التكرار والتحقق في cart.html
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        window.preventDoubleSubmit('checkout-form');
        checkoutForm.addEventListener('submit', function(e) {
            const phone = document.getElementById('customer-phone');
            if (phone && !window.isValidSaudiMobile(phone.value)) {
                e.preventDefault();
                showToast("يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05", "#d32f2f");
                phone.focus();
                checkoutForm.dataset.submitted = "";
                return false;
            }
        });
    }
});
