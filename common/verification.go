package common

import (
	"crypto/rand"
	"math/big"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

type verificationValue struct {
	code string
	time time.Time
}

const (
	EmailVerificationPurpose = "v"
	PasswordResetPurpose     = "r"
)

var verificationMutex sync.Mutex
var verificationMap map[string]verificationValue
var verificationMapMaxSize = 10
var VerificationValidMinutes = 10

func GenerateVerificationCode(length int) string {
	code := uuid.New().String()
	code = strings.Replace(code, "-", "", -1)
	if length == 0 {
		return code
	}
	return code[:length]
}

// GenerateNumericCode returns a random code made only of digits.
//
// The console treats email verification codes as digits: the sign-up form
// strips every non-digit character as it is typed and validates the field with
// /^\d{6}$/ before submitting (the same rule guards the email-binding dialog).
// GenerateVerificationCode returns a UUID prefix, which is hexadecimal, so a
// code containing a-f can never be entered. Email verification therefore always
// fails once the random code happens to include a letter.
func GenerateNumericCode(length int) string {
	if length <= 0 {
		return ""
	}
	digits := make([]byte, length)
	ten := big.NewInt(10)
	for i := range digits {
		n, err := rand.Int(rand.Reader, ten)
		if err != nil {
			// crypto/rand is not expected to fail on supported platforms. Should it
			// happen, fall back to a time-derived digit instead of a fixed value.
			digits[i] = byte('0' + (time.Now().UnixNano()>>uint(i*3))%10)
			continue
		}
		digits[i] = byte('0' + n.Int64())
	}
	return string(digits)
}

func RegisterVerificationCodeWithKey(key string, code string, purpose string) {
	verificationMutex.Lock()
	defer verificationMutex.Unlock()
	verificationMap[purpose+key] = verificationValue{
		code: code,
		time: time.Now(),
	}
	if len(verificationMap) > verificationMapMaxSize {
		removeExpiredPairs()
	}
}

func VerifyCodeWithKey(key string, code string, purpose string) bool {
	verificationMutex.Lock()
	defer verificationMutex.Unlock()
	value, okay := verificationMap[purpose+key]
	now := time.Now()
	if !okay || int(now.Sub(value.time).Seconds()) >= VerificationValidMinutes*60 {
		return false
	}
	return code == value.code
}

func DeleteKey(key string, purpose string) {
	verificationMutex.Lock()
	defer verificationMutex.Unlock()
	delete(verificationMap, purpose+key)
}

// no lock inside, so the caller must lock the verificationMap before calling!
func removeExpiredPairs() {
	now := time.Now()
	for key := range verificationMap {
		if int(now.Sub(verificationMap[key].time).Seconds()) >= VerificationValidMinutes*60 {
			delete(verificationMap, key)
		}
	}
}

func init() {
	verificationMutex.Lock()
	defer verificationMutex.Unlock()
	verificationMap = make(map[string]verificationValue)
}
